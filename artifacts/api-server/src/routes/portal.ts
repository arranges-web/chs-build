import { Router, type IRouter } from "express";
import { eq, sql, desc } from "drizzle-orm";
import {
  db,
  customersTable,
  jobsTable,
  jobUpdatesTable,
  jobPhotosTable,
} from "@workspace/db";
import { isEmail, normalizeAccount } from "../lib/accountNumber";
import { handleError } from "../lib/handleError";

const router: IRouter = Router();

router.post("/portal/lookup", async (req, res) => {
  try {
    const id = String(req.body?.identifier ?? "").trim();
    if (!id) {
      res.status(400).json({ error: "Please enter your email or account number." });
      return;
    }

    const [customer] = await db
      .select()
      .from(customersTable)
      .where(
        isEmail(id)
          ? sql`lower(${customersTable.email}) = ${id.toLowerCase()}`
          : eq(customersTable.accountNumber, normalizeAccount(id)),
      )
      .limit(1);

    if (!customer) {
      res
        .status(404)
        .json({ error: "We couldn't find an account with that email or account number." });
      return;
    }

    const jobs = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.customerId, customer.id))
      .orderBy(desc(jobsTable.createdAt));

    const jobIds = jobs.map((j) => j.id);

    const updates = jobIds.length
      ? await db
          .select()
          .from(jobUpdatesTable)
          .where(sql`${jobUpdatesTable.jobId} = ANY (${jobIds})`)
          .orderBy(desc(jobUpdatesTable.createdAt))
      : [];

    const photos = jobIds.length
      ? await db
          .select()
          .from(jobPhotosTable)
          .where(sql`${jobPhotosTable.jobId} = ANY (${jobIds})`)
          .orderBy(desc(jobPhotosTable.createdAt))
      : [];

    res.json({
      customer: {
        id: customer.id,
        accountNumber: customer.accountNumber,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
      },
      jobs: jobs.map((j) => ({
        ...j,
        updates: updates.filter((u) => u.jobId === j.id),
        photos: photos.filter((p) => p.jobId === j.id),
      })),
    });
  } catch (err) {
    handleError(res, err);
  }
});

export default router;
