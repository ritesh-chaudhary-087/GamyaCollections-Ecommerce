import React, { useEffect, useState } from "react";
import { Building, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Banner from "@/components/Banner";
import src from "/assets/Images/banner/contact.png";
import ApiService from "@/components/API/api-service";
import { useAuth } from "@/components/AuthContext/AuthContext";

export default function ContactForm() {
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    agreeToPolicy: false,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      const fullName = user.name || "";
      const [first = "", ...rest] = fullName.split(" ");
      const last = rest.join(" ");
      setFormData((prev) => ({
        ...prev,
        firstName: first,
        lastName: last,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, agreeToPolicy: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeToPolicy) return;
    try {
      setSubmitting(true);
      const payload = {
        name:
          isAuthenticated && user?.name
            ? user.name
            : `${formData.firstName} ${formData.lastName}`.trim(),
        email: isAuthenticated && user?.email ? user.email : formData.email,
        subject: formData.subject || undefined,
        message: formData.message,
      };
      await ApiService.createContact(payload);
      alert("Thanks! Your message has been sent.");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
        agreeToPolicy: false,
      });
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error.message ||
          "Failed to send message"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid mx-auto sm:px-0 overflow-hidden">
      <Banner src={src} />
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto sm:px-20 sm:py-28 py-7 px-4">
        <Card className="shadow-md  ">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Contact us</h2>
            <form onSubmit={handleSubmit} className="space-y-4 ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="subject"
                  name="subject"
                  placeholder="Subject (optional)"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeToPolicy"
                  checked={formData.agreeToPolicy}
                  onCheckedChange={handleCheckboxChange}
                  required
                />
                <Label htmlFor="agreeToPolicy" className="text-sm">
                  You agree to our{" "}
                  <Link to="#" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#a63c15] hover:bg-[#cf6b47] "
              >
                {submitting ? "SENDING..." : "SEND MESSAGE"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="space-y-8 pt-4 px-4">
          <div>
            <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground">
              You need more information? Check what other persons are saying
              about our product. They are very happy with their purchase.
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-4">
              <div className="bg-[#a63c15]  p-3 rounded-md">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Find us at the office</h3>
                <address className="not-italic text-muted-foreground mt-2">
                  Flat No.1, Yugmanest Building, Shinde Ali, 169, Shukrawar
                  Peth, Near Kelkar Museum, Pune (Municipal Corporation.), Pune
                  - 411002
                </address>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-4">
              <div className="bg-[#a63c15]  p-3 rounded-md">
                <Phone className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-medium">Give us a ring</h3>
                <div className="text-muted-foreground mt-2">
                  <p>+91 90112 09181</p>
                  {/* <p>Mon - Fri, 8:00AM - 07:00PM</p> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
