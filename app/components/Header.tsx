import { Navbar, NavbarBrand } from "@nextui-org/navbar"
import { twMerge } from "tailwind-merge"

export const Header = ({ className }: { className?: string }) => {
  return (
    <Navbar
      isBlurred={false}
      className={twMerge("bg-cyan-700 text-white fixed", className)}
    >
      <NavbarBrand>URL Press - URL Shortener for Team</NavbarBrand>
    </Navbar>
  )
}
