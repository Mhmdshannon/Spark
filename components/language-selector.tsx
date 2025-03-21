"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-spark-silver-300 hover:text-white hover:bg-spark-dark-700"
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">{t("settings.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-spark-dark-700 border-spark-dark-600 text-spark-silver-100">
        <DropdownMenuItem
          className={`hover:bg-spark-dark-600 ${language === "en" ? "bg-spark-dark-600" : ""}`}
          onClick={() => setLanguage("en")}
        >
          {t("settings.english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`hover:bg-spark-dark-600 ${language === "ar" ? "bg-spark-dark-600" : ""}`}
          onClick={() => setLanguage("ar")}
        >
          {t("settings.arabic")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

