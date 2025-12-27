"use client";
import { Brain, Menu, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import clsx from "clsx";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      color: "from-slate-600 to-gray-500",
    },
    {
      href: "/content-creation",
      label: "Tạo nội dung",
      color: "from-green-600 to-lime-500",
    },
    {
      href: "/social-accounts",
      label: "Tài khoản MXH",
      color: "from-blue-600 to-cyan-500",
    },
    // {
    //   href: "/cms",
    //   label: "CMS",
    //   color: "from-purple-600 to-indigo-500",
    // },
    {
      href: "/archive",
      label: "Lưu trữ",
      color: "from-orange-600 to-amber-500",
    },
  ];

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      if (res.ok) {
        toast.success("Đăng xuất thành công");
        router.push("/login");
        router.refresh();
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
      setLoggingOut(false);
    }
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="lg:block hidden text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Marketing Engine
            </span>
            <span className="lg:hidden text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AIME
            </span>
          </Link>

          {/* Navigation (PC only) */}
          <nav className="hidden md:flex items-center space-x-1 bg-gray-100 rounded-lg p-1 relative">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={clsx(
                      "relative transition-all duration-300",
                      isActive ? "bg-white shadow-sm" : "hover:bg-white/60"
                    )}
                  >
                    <span
                      className={clsx(
                        "transition-all duration-300",
                        isActive
                          ? "text-transparent bg-clip-text bg-gradient-to-r " +
                              item.color
                          : "text-gray-700"
                      )}
                    >
                      {item.label}
                    </span>
                    <span
                      className={clsx(
                        "absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-all duration-300 bg-gradient-to-r",
                        item.color,
                        isActive
                          ? "opacity-100 scale-x-100"
                          : "opacity-0 scale-x-0"
                      )}
                    />
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dashboard + User Menu */}
        <div className="flex items-center space-x-2">
          {/* User Dropdown Menu with Logout */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} disabled={loggingOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Nút menu mobile */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </Dialog.Trigger>

            {/* Modal giữa màn hình */}
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
              <Dialog.Content className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl shadow-lg w-80 max-w-[90%] p-6 space-y-4 text-center">
                  <Dialog.Title className="text-lg font-bold mb-2">
                    Menu
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-gray-500">
                    Chọn mục bạn muốn truy cập từ danh sách bên dưới.
                  </Dialog.Description>
                  <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setOpen(false)}
                        >
                          <Button
                            variant="ghost"
                            className={clsx(
                              "w-full justify-center relative transition-all duration-300",
                              isActive
                                ? "bg-white shadow-sm"
                                : "hover:bg-gray-50"
                            )}
                          >
                            <span
                              className={clsx(
                                "transition-all duration-300",
                                isActive
                                  ? "text-transparent bg-clip-text bg-gradient-to-r " +
                                      item.color
                                  : "text-gray-700"
                              )}
                            >
                              {item.label}
                            </span>
                            <span
                              className={clsx(
                                "absolute bottom-0 left-0 w-full h-[2px] rounded-full transition-all duration-300 bg-gradient-to-r",
                                item.color,
                                isActive
                                  ? "opacity-100 scale-x-100"
                                  : "opacity-0 scale-x-0"
                              )}
                            />
                          </Button>
                        </Link>
                      );
                    })}
                    
                    {/* Logout button for mobile */}
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      disabled={loggingOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
                    </Button>
                  </nav>

                  <Dialog.Close asChild>
                    <Button className="mt-4 w-full" variant="secondary">
                      Đóng
                    </Button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}

export default Nav;
