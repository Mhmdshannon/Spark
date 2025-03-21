"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CheckCircle, CreditCard } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { useLanguage } from "@/context/language-context"
import { createOrUpdateSubscription } from "@/lib/subscription-service"
import { toast } from "@/hooks/use-toast"

const plans = [
  {
    id: "monthly",
    name: "payment.monthly",
    price: 49.99,
    duration: 1,
  },
  {
    id: "quarterly",
    name: "payment.quarterly",
    price: 129.99,
    duration: 3,
    popular: true,
  },
  {
    id: "yearly",
    name: "payment.yearly",
    price: 399.99,
    duration: 12,
    discount: "33%",
  },
]

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState(plans[1].id)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to make a payment",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
      toast({
        title: "Error",
        description: "Please fill in all card details",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // In a real app, you would process the payment with a payment provider here
      // For this demo, we'll simulate a successful payment

      // Get the selected plan
      const plan = plans.find((p) => p.id === selectedPlan)!

      // Calculate subscription dates
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + plan.duration)

      // Create or update subscription
      const subscription = await createOrUpdateSubscription({
        user_id: user.id,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        plan_type: selectedPlan as "monthly" | "quarterly" | "yearly",
        status: "active",
        amount: plan.price,
        payment_id: `payment_${Date.now()}`, // In a real app, this would come from the payment provider
      })

      if (subscription) {
        toast({
          title: "Success",
          description: "Your payment was successful and your subscription has been activated",
        })

        // Redirect to subscription page
        router.push("/subscription")
      } else {
        throw new Error("Failed to create subscription")
      }
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-5xl">
      <div className="mb-6">
        <Link href="/subscription" passHref>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("back_to_subscription")}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight premium-text-gradient">{t("payment.title")}</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-spark-silver-100">{t("payment.select_plan")}</CardTitle>
                <CardDescription className="text-spark-silver-400">{t("payment.select_plan_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative flex items-center space-x-2 rounded-md border p-4 ${selectedPlan === plan.id ? "border-spark-red-500 bg-spark-dark-700" : "border-spark-dark-600"}`}
                    >
                      <RadioGroupItem value={plan.id} id={plan.id} className="border-spark-silver-400" />
                      <Label htmlFor={plan.id} className="flex flex-1 cursor-pointer justify-between">
                        <div>
                          <div className="font-medium text-spark-silver-100">{t(plan.name)}</div>
                          <div className="text-sm text-spark-silver-400">
                            {plan.duration} {plan.duration === 1 ? t("payment.month") : t("payment.months")}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-spark-silver-100">${plan.price}</div>
                          {plan.discount && (
                            <div className="text-sm text-spark-red-400">
                              {t("payment.save")} {plan.discount}
                            </div>
                          )}
                        </div>
                      </Label>
                      {plan.popular && (
                        <div className="absolute -top-2 right-4 rounded-full bg-spark-red-500 px-2 py-0.5 text-xs font-medium text-white">
                          {t("payment.popular")}
                        </div>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <Card className="premium-card">
                <CardHeader>
                  <CardTitle className="text-spark-silver-100">{t("payment.card_details")}</CardTitle>
                  <CardDescription className="text-spark-silver-400">{t("payment.card_details_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="number" className="text-spark-silver-200">
                      {t("payment.card_number")}
                    </Label>
                    <Input
                      id="number"
                      name="number"
                      placeholder="1234 5678 9012 3456"
                      className="premium-input"
                      value={cardDetails.number}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-spark-silver-200">
                        {t("payment.expiry")}
                      </Label>
                      <Input
                        id="expiry"
                        name="expiry"
                        placeholder="MM/YY"
                        className="premium-input"
                        value={cardDetails.expiry}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-spark-silver-200">
                        {t("payment.cvv")}
                      </Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="123"
                        className="premium-input"
                        value={cardDetails.cvv}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-spark-silver-200">
                      {t("payment.name")}
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="premium-input"
                      value={cardDetails.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full premium-button" disabled={isProcessing}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isProcessing ? t("payment.processing") : t("payment.submit")}
                  </Button>
                </CardFooter>
              </Card>
            </form>

            <div className="mt-4 rounded-lg border border-spark-dark-600 bg-spark-dark-800 p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-spark-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-spark-silver-100">{t("payment.secure")}</h3>
                  <p className="text-sm text-spark-silver-400">{t("payment.secure_desc")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

