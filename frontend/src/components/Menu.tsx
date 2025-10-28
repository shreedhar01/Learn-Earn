"use client"

import { MenuIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { ThemeSwitcher } from "./ThemeSwitcher"
import SignIn from "./SignIn"
import { Button } from "./ui/button"

export default function Menu() {


  return (
    <>
      <div className="md:hidden">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" aria-label="Open menu" size="icon-sm">
              <MenuIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent  align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem >
                <SignIn />
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-end">
                <ThemeSwitcher />
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="hidden md:flex gap-2 items-center">
        <SignIn/>
        <ThemeSwitcher />
      </div>
    </>
  )
}
