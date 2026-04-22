import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  serviceType: z.string().min(1, "Please select a service"),
  message: z.string().min(10, "Please describe your project or issue briefly"),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      serviceType: "",
      message: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast({
      title: "Request Received",
      description: "We'll be in touch shortly to provide your free quote.",
    });
    form.reset();
  };

  if (isSuccess) {
    return (
      <div className="bg-primary/5 border border-primary/20 p-8 rounded-xl text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">Request Received!</h3>
          <p className="text-muted-foreground mt-2">
            Thank you for choosing CHS Roofing. Our team will contact you shortly to schedule your free estimate.
          </p>
        </div>
        <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
          Submit Another Request
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card p-8 rounded-xl shadow-xl border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
      
      <div className="mb-6">
        <h3 className="text-2xl font-bold font-display uppercase tracking-tight text-foreground">Get a Free Quote</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(239) XXX-XXXX" type="tel" {...field} className="bg-background" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" type="email" {...field} className="bg-background" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Service Needed</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select a roofing service" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="shingle">Asphalt Shingles</SelectItem>
                    <SelectItem value="metal">Metal Roofing</SelectItem>
                    <SelectItem value="tile">Tile Roofing</SelectItem>
                    <SelectItem value="flat">Flat / TPO Roofing</SelectItem>
                    <SelectItem value="repair">Roof Repair</SelectItem>
                    <SelectItem value="commercial">Commercial Roofing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Project Details</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us about your roof, storm damage, or project goals..." 
                    className="resize-none min-h-[100px] bg-background"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 text-base font-bold tracking-wide mt-2 hover-elevate" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">Sending Request...</span>
            ) : (
              <span className="flex items-center gap-2">
                Get Your Free Quote <Send className="w-4 h-4 ml-1" />
              </span>
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            By submitting, you agree to be contacted by CHS Roofing regarding your inquiry.
          </p>
        </form>
      </Form>
    </div>
  );
}
