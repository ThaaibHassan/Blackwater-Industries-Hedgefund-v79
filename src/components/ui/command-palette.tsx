import * as React from "react"
import { useNavigate } from "react-router-dom"
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator,
  CommandShortcut 
} from "@/components/ui/command"
import { 
  LayoutDashboard, 
  Wallet, 
  TrendingUp, 
  Search, 
  Users, 
  FileText, 
  Shield, 
  Calendar, 
  Settings,
  Activity,
  BarChart3,
  Building2
} from "lucide-react"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate()

  const navigationItems = [
    { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { title: "Portfolio", href: "/portfolio", icon: Wallet },
    { title: "Trades", href: "/trades", icon: TrendingUp },
    { title: "Research", href: "/research", icon: Search },
    { title: "Market Screener", href: "/screener", icon: BarChart3 },
    { title: "Accounts", href: "/mt5", icon: Activity },
    { title: "Investors", href: "/investors", icon: Users },
    { title: "Reports", href: "/reports", icon: FileText },
    { title: "Compliance", href: "/compliance", icon: Shield },
    { title: "Tasks", href: "/tasks", icon: Calendar },
    { title: "Settings", href: "/settings", icon: Settings },
  ]

  const handleSelect = (href: string) => {
    navigate(href)
    onOpenChange(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <CommandItem
                key={item.href}
                onSelect={() => handleSelect(item.href)}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </CommandItem>
            )
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect("/portfolio")}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>View Portfolio</span>
            <CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/trades")}>
            <TrendingUp className="mr-2 h-4 w-4" />
            <span>Recent Trades</span>
            <CommandShortcut>⌘T</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/research")}>
            <Search className="mr-2 h-4 w-4" />
            <span>Research Notes</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/investors")}>
            <Users className="mr-2 h-4 w-4" />
            <span>Investor Portal</span>
            <CommandShortcut>⌘I</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem onSelect={() => handleSelect("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}

export default CommandPalette 