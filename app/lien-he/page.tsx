"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FinisherHeader from "@/components/FinisherHeader";
import { Brain, X, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import Link from "next/link";
import Footer from "@/components/Footer";
type ContactFormValues = {
  firstName: string;
  lastName: string;
  company?: string;
  email: string;
  country: string;
  phoneNumber: string;
  message: string;
};
export default function page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const form = useForm<ContactFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      company: "",
      email: "",
      country: "VN",
      phoneNumber: "",
      message: "",
    },
  });

  const onSubmit = (values: ContactFormValues) => {
    console.log("Form data:", values);
    alert("Gửi liên hệ thành công!");
  };
  return (
    <main>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Marketing Engine
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Tính năng
            </Link>
            <Link
              href="/"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Bảng giá
            </Link>
            <Link
              href="/lien-he"
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Liên hệ
            </Link>
            <Link href="/brand-analysis">
              <Button>Đăng Nhập</Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link
                href="#features"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tính năng
              </Link>
              <Link
                href="#pricing"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bảng giá
              </Link>
              <Link
                href="#contact"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Liên hệ
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-600 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full">Đăng nhập</Button>
              </Link>
            </nav>
          </div>
        )}
      </header>
      <section>
        <FinisherHeader />
        <div className="isolate  px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Liên Hệ Với Chúng Tôi
            </h2>
            <p className="mt-2 text-lg/8 text-gray-600">
              Nếu bạn có câu hỏi hoặc muốn hợp tác, hãy điền vào form bên dưới.
              Chúng tôi sẽ phản hồi bạn sớm nhất có thể.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mx-auto mt-16 max-w-xl sm:mt-20"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "Họ là bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nguyễn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: "Tên là bắt buộc" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Văn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Công ty (Tùy chọn)</FormLabel>
                      <FormControl>
                        <Input placeholder="Tên công ty của bạn" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email là bắt buộc",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email không hợp lệ",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  rules={{ required: "Số điện thoại là bắt buộc" }}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <div className="flex gap-2 mt-2.5">
                        {/* Select quốc gia */}
                        <FormControl>
                          <Select
                            onValueChange={(val) =>
                              form.setValue("country", val)
                            }
                            value={form.getValues("country")}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue placeholder="VN" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="VN">
                                <span className="mr-2">🇻🇳</span> VN
                              </SelectItem>
                              <SelectItem value="US">
                                <span className="mr-2">🇺🇸</span> US
                              </SelectItem>
                              <SelectItem value="CA">
                                <span className="mr-2">🇨🇦</span> CA
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>

                        {/* Input số điện thoại */}
                        <FormControl className="flex-1">
                          <Input placeholder="0123-456-789" {...field} />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  rules={{ required: "Nội dung liên hệ là bắt buộc" }}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormControl>
                        <Textarea
                          placeholder="Nhập nội dung bạn muốn gửi..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-10">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Gửi liên hệ
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
