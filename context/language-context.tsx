"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Language = "en" | "ar"

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

export const useLanguage = () => useContext(LanguageContext)

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "app.name": "Spark Fitness",
    "app.tagline": "Ignite your fitness journey",
    loading: "Loading...",
    back_to_dashboard: "Back to Dashboard",
    "nav.dashboard": "Dashboard",
    "nav.workouts": "Workouts",
    "nav.exercises": "Exercise Library",
    "nav.timer": "Timer",
    "nav.profile": "Profile",
    "nav.progress": "Progress Photos",
    "nav.analytics": "Analytics",
    "nav.settings": "Settings",
    "nav.subscription": "Subscription",
    "nav.admin": "Admin Dashboard",
    "nav.logout": "Logout",
    "nav.meal_plans": "Meal Plans",
    "nav.coach_notes": "Coach Notes",
    "nav.search": "Search...",

    // Subscription
    "subscription.title": "Your Membership",
    "subscription.joined": "Joined",
    "subscription.expires": "Expires",
    "subscription.status": "Status",
    "subscription.active": "Active",
    "subscription.expired": "Expired",
    "subscription.renew": "Renew Membership",
    "subscription.days_left": "Days Left",
    "subscription.progress": "Membership Progress",
    "subscription.plan": "Plan",
    "subscription.no_subscription": "No Active Membership",
    "subscription.no_subscription_desc": "You don't have an active membership yet.",
    "subscription.get_started": "Get Started",
    "subscription.membership_benefits": "Membership Benefits",
    "subscription.benefits_desc": "Enjoy these benefits with your Spark Fitness membership",
    "subscription.benefit_1": "Unlimited access to all workout programs",
    "subscription.benefit_2": "Personalized meal plans from certified nutritionists",
    "subscription.benefit_3": "One-on-one coaching sessions",
    "subscription.benefit_4": "Progress tracking and analytics",
    "subscription.benefit_5": "Access to exclusive fitness content",
    "subscription.expired_message": "Your membership has expired. Renew now to continue your fitness journey.",

    // Admin
    "admin.dashboard": "Admin Dashboard",
    "admin.members": "Members",
    "admin.workouts": "Workouts",
    "admin.meal_plans": "Meal Plans",
    "admin.notes": "Coach Notes",
    "admin.add_workout": "Add Workout",
    "admin.add_meal": "Add Meal Plan",
    "admin.add_note": "Add Note",
    "admin.total_members": "Total Members",
    "admin.active_members": "Active members in the system",
    "admin.total_workouts": "Total Workouts",
    "admin.assigned_workouts": "Workouts assigned to members",
    "admin.total_meal_plans": "Total Meal Plans",
    "admin.active_meal_plans": "Active meal plans",
    "admin.total_notes": "Total Notes",
    "admin.coach_feedback": "Coach feedback notes",
    "admin.members_list": "Members List",
    "admin.members_list_desc": "Manage your gym members",
    "admin.workouts_list": "Workouts List",
    "admin.workouts_list_desc": "Manage workout programs",
    "admin.meal_plans_list": "Meal Plans List",
    "admin.meal_plans_list_desc": "Manage nutrition plans",
    "admin.notes_list": "Coach Notes List",
    "admin.notes_list_desc": "Manage feedback and notes",
    "admin.search_members": "Search members...",
    "admin.search_workouts": "Search workouts...",
    "admin.search_meal_plans": "Search meal plans...",
    "admin.search_notes": "Search notes...",
    "admin.export": "Export",
    "admin.member": "Member",
    "admin.status": "Status",
    "admin.plan": "Plan",
    "admin.joined": "Joined",
    "admin.expires": "Expires",
    "admin.actions": "Actions",
    "admin.active": "Active",
    "admin.expired": "Expired",
    "admin.days_left": "days left",
    "admin.open_menu": "Open Menu",
    "admin.edit": "Edit",
    "admin.delete": "Delete",
    "admin.view": "View",
    "admin.assign": "Assign",
    "admin.no_results": "No results found",
    "admin.no_members": "No members found",
    "admin.no_workouts": "No workouts found",
    "admin.no_meal_plans": "No meal plans found",
    "admin.no_notes": "No notes found",
    "admin.meal_plan": "Meal Plan",
    "admin.assigned_to": "Assigned To",
    "admin.start_date": "Start Date",
    "admin.end_date": "End Date",
    "admin.title": "Title",
    "admin.coach": "Coach",
    "admin.date": "Date",
    "admin.workout": "Workout",
    "admin.type": "Type",
    "admin.assigned": "Assigned",
    "admin.created": "Created",

    // Payment
    "payment.title": "Renew Membership",
    "payment.select_plan": "Select Plan",
    "payment.select_plan_desc": "Choose the membership plan that works best for you",
    "payment.monthly": "Monthly",
    "payment.quarterly": "3 Months",
    "payment.yearly": "Annual",
    "payment.month": "month",
    "payment.months": "months",
    "payment.save": "Save",
    "payment.popular": "Popular",
    "payment.card_details": "Card Details",
    "payment.card_details_desc": "Enter your payment information securely",
    "payment.card_number": "Card Number",
    "payment.expiry": "Expiry Date",
    "payment.cvv": "CVV",
    "payment.name": "Name on Card",
    "payment.submit": "Complete Payment",
    "payment.processing": "Processing...",
    "payment.secure": "Secure Payment",
    "payment.secure_desc": "Your payment information is encrypted and secure",

    // Settings
    "settings.language": "Language",
    "settings.language_desc": "Choose your preferred language",
    "settings.english": "English",
    "settings.arabic": "Arabic",
    "settings.notifications": "Notifications",
    "settings.notifications_desc": "Manage how you receive notifications",
    "settings.email_notifications": "Email Notifications",
    "settings.email_notifications_desc": "Receive updates via email",
    "settings.push_notifications": "Push Notifications",
    "settings.push_notifications_desc": "Receive notifications on your device",
    "settings.workout_reminders": "Workout Reminders",
    "settings.workout_reminders_desc": "Get reminded about your scheduled workouts",
    "settings.product_updates": "Product Updates",
    "settings.product_updates_desc": "Receive updates about new features",
    "settings.security": "Security",
    "settings.account": "Account",

    // Meal Plans
    "meal_plans.title": "Your Meal Plans",
    "meal_plans.days": "days",
    "meal_plans.no_plans": "No Meal Plans",
    "meal_plans.no_plans_desc": "You don't have any meal plans assigned yet",
    "meal_plans.no_plans_message":
      "Your coach hasn't assigned any meal plans yet. Check back later or contact your coach for more information.",

    // Coach Notes
    "coach_notes.title": "Coach Notes",
    "coach_notes.from": "From",
    "coach_notes.no_notes": "No Coach Notes",
    "coach_notes.no_notes_desc": "You don't have any notes from your coach yet",
    "coach_notes.no_notes_message":
      "Your coach hasn't left any notes yet. Check back later for feedback and guidance on your progress.",
  },
  ar: {
    // Common
    "app.name": "سبارك فيتنس",
    "app.tagline": "أشعل رحلة لياقتك البدنية",
    loading: "جاري التحميل...",
    back_to_dashboard: "العودة إلى لوحة التحكم",
    "nav.dashboard": "لوحة التحكم",
    "nav.workouts": "التمارين",
    "nav.exercises": "مكتبة التمارين",
    "nav.timer": "المؤقت",
    "nav.profile": "الملف الشخصي",
    "nav.progress": "صور التقدم",
    "nav.analytics": "التحليلات",
    "nav.settings": "الإعدادات",
    "nav.subscription": "الاشتراك",
    "nav.admin": "لوحة تحكم المسؤول",
    "nav.logout": "تسجيل الخروج",
    "nav.meal_plans": "خطط الوجبات",
    "nav.coach_notes": "ملاحظات المدرب",
    "nav.search": "بحث...",

    // Subscription
    "subscription.title": "عضويتك",
    "subscription.joined": "تاريخ الانضمام",
    "subscription.expires": "تاريخ الانتهاء",
    "subscription.status": "الحالة",
    "subscription.active": "نشط",
    "subscription.expired": "منتهي",
    "subscription.renew": "تجديد العضوية",
    "subscription.days_left": "الأيام المتبقية",
    "subscription.progress": "تقدم العضوية",
    "subscription.plan": "خطة",
    "subscription.no_subscription": "لا توجد عضوية نشطة",
    "subscription.no_subscription_desc": "ليس لديك عضوية نشطة حتى الآن.",
    "subscription.get_started": "ابدأ الآن",
    "subscription.membership_benefits": "مزايا العضوية",
    "subscription.benefits_desc": "استمتع بهذه المزايا مع عضوية سبارك فيتنس",
    "subscription.benefit_1": "وصول غير محدود إلى جميع برامج التمرين",
    "subscription.benefit_2": "خطط وجبات مخصصة من خبراء تغذية معتمدين",
    "subscription.benefit_3": "جلسات تدريب فردية",
    "subscription.benefit_4": "تتبع التقدم والتحليلات",
    "subscription.benefit_5": "الوصول إلى محتوى اللياقة البدنية الحصري",
    "subscription.expired_message": "انتهت صلاحية عضويتك. جدد الآن لمواصلة رحلة لياقتك البدنية.",

    // Admin
    "admin.dashboard": "لوحة تحكم المسؤول",
    "admin.members": "الأعضاء",
    "admin.workouts": "التمارين",
    "admin.meal_plans": "خطط الوجبات",
    "admin.notes": "ملاحظات المدرب",
    "admin.add_workout": "إضافة تمرين",
    "admin.add_meal": "إضافة خطة وجبات",
    "admin.add_note": "إضافة ملاحظة",
    "admin.total_members": "إجمالي الأعضاء",
    "admin.active_members": "الأعضاء النشطين في النظام",
    "admin.total_workouts": "إجمالي التمارين",
    "admin.assigned_workouts": "التمارين المخصصة للأعضاء",
    "admin.total_meal_plans": "إجمالي خطط الوجبات",
    "admin.active_meal_plans": "خطط الوجبات النشطة",
    "admin.total_notes": "إجمالي الملاحظات",
    "admin.coach_feedback": "ملاحظات المدرب",
    "admin.members_list": "قائمة الأعضاء",
    "admin.members_list_desc": "إدارة أعضاء الصالة الرياضية",
    "admin.workouts_list": "قائمة التمارين",
    "admin.workouts_list_desc": "إدارة برامج التمرين",
    "admin.meal_plans_list": "قائمة خطط الوجبات",
    "admin.meal_plans_list_desc": "إدارة خطط التغذية",
    "admin.notes_list": "قائمة ملاحظات المدرب",
    "admin.notes_list_desc": "إدارة الملاحظات والتعليقات",
    "admin.search_members": "البحث عن أعضاء...",
    "admin.search_workouts": "البحث عن تمارين...",
    "admin.search_meal_plans": "البحث عن خطط وجبات...",
    "admin.search_notes": "البحث عن ملاحظات...",
    "admin.export": "تصدير",
    "admin.member": "العضو",
    "admin.status": "الحالة",
    "admin.plan": "الخطة",
    "admin.joined": "تاريخ الانضمام",
    "admin.expires": "تاريخ الانتهاء",
    "admin.actions": "الإجراءات",
    "admin.active": "نشط",
    "admin.expired": "منتهي",
    "admin.days_left": "يوم متبقي",
    "admin.open_menu": "فتح القائمة",
    "admin.edit": "تعديل",
    "admin.delete": "حذف",
    "admin.view": "عرض",
    "admin.assign": "تخصيص",
    "admin.no_results": "لا توجد نتائج",
    "admin.no_members": "لا يوجد أعضاء",
    "admin.no_workouts": "لا توجد تمارين",
    "admin.no_meal_plans": "لا توجد خطط وجبات",
    "admin.no_notes": "لا توجد ملاحظات",
    "admin.meal_plan": "خطة الوجبات",
    "admin.assigned_to": "مخصص لـ",
    "admin.start_date": "تاريخ البدء",
    "admin.end_date": "تاريخ الانتهاء",
    "admin.title": "العنوان",
    "admin.coach": "المدرب",
    "admin.date": "التاريخ",
    "admin.workout": "التمرين",
    "admin.type": "النوع",
    "admin.assigned": "مخصص",
    "admin.created": "تاريخ الإنشاء",

    // Payment
    "payment.title": "تجديد العضوية",
    "payment.select_plan": "اختر الخطة",
    "payment.select_plan_desc": "اختر خطة العضوية التي تناسبك",
    "payment.monthly": "شهري",
    "payment.quarterly": "3 أشهر",
    "payment.yearly": "سنوي",
    "payment.month": "شهر",
    "payment.months": "أشهر",
    "payment.save": "وفر",
    "payment.popular": "الأكثر شعبية",
    "payment.card_details": "تفاصيل البطاقة",
    "payment.card_details_desc": "أدخل معلومات الدفع الخاصة بك بأمان",
    "payment.card_number": "رقم البطاقة",
    "payment.expiry": "تاريخ الانتهاء",
    "payment.cvv": "رمز التحقق",
    "payment.name": "الاسم على البطاقة",
    "payment.submit": "إتمام الدفع",
    "payment.processing": "جاري المعالجة...",
    "payment.secure": "دفع آمن",
    "payment.secure_desc": "معلومات الدفع الخاصة بك مشفرة وآمنة",

    // Settings
    "settings.language": "اللغة",
    "settings.language_desc": "اختر لغتك المفضلة",
    "settings.english": "الإنجليزية",
    "settings.arabic": "العربية",
    "settings.notifications": "الإشعارات",
    "settings.notifications_desc": "إدارة كيفية تلقي الإشعارات",
    "settings.email_notifications": "إشعارات البريد الإلكتروني",
    "settings.email_notifications_desc": "تلقي التحديثات عبر البريد الإلكتروني",
    "settings.push_notifications": "إشعارات الدفع",
    "settings.push_notifications_desc": "تلقي الإشعارات على جهازك",
    "settings.workout_reminders": "تذكيرات التمرين",
    "settings.workout_reminders_desc": "الحصول على تذكير بالتمارين المجدولة",
    "settings.product_updates": "تحديثات المنتج",
    "settings.product_updates_desc": "تلقي تحديثات حول الميزات الجديدة",
    "settings.security": "الأمان",
    "settings.account": "الحساب",

    // Meal Plans
    "meal_plans.title": "خطط الوجبات الخاصة بك",
    "meal_plans.days": "أيام",
    "meal_plans.no_plans": "لا توجد خطط وجبات",
    "meal_plans.no_plans_desc": "لم يتم تخصيص أي خطط وجبات لك بعد",
    "meal_plans.no_plans_message":
      "لم يقم مدربك بتخصيص أي خطط وجبات بعد. تحقق لاحقًا أو اتصل بمدربك لمزيد من المعلومات.",

    // Coach Notes
    "coach_notes.title": "ملاحظات المدرب",
    "coach_notes.from": "من",
    "coach_notes.no_notes": "لا توجد ملاحظات من المدرب",
    "coach_notes.no_notes_desc": "ليس لديك أي ملاحظات من مدربك بعد",
    "coach_notes.no_notes_message": "لم يترك مدربك أي ملاحظات بعد. تحقق لاحقًا للحصول على تعليقات وإرشادات حول تقدمك.",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguageState(savedLanguage)

      // Set the dir attribute on the html element for RTL support
      document.documentElement.dir = savedLanguage === "ar" ? "rtl" : "ltr"

      // Add or remove the RTL class for additional styling
      if (savedLanguage === "ar") {
        document.documentElement.classList.add("rtl")
      } else {
        document.documentElement.classList.remove("rtl")
      }
    }
  }, [])

  // Save language preference to localStorage when it changes
  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem("language", newLanguage)

    // Set the dir attribute on the html element for RTL support
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr"

    // Add or remove the RTL class for additional styling
    if (newLanguage === "ar") {
      document.documentElement.classList.add("rtl")
    } else {
      document.documentElement.classList.remove("rtl")
    }
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

