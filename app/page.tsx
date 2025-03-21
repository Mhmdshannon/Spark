import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, Dumbbell, Clock, ArrowRight } from "lucide-react"
import { SparkLogoFull } from "@/components/spark-logo"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-spark-dark-900 text-spark-silver-100">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 premium-gradient">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <SparkLogoFull className="mx-auto mb-6" />
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none premium-text-gradient">
                  SPARK FITNESS
                </h1>
                <p className="mx-auto max-w-[700px] text-spark-silver-200 md:text-xl">
                  Ignite your fitness journey with personalized workouts and expert coaching.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/login" passHref>
                  <Button className="bg-spark-dark-700 text-white hover:bg-spark-dark-600">Login</Button>
                </Link>
                <Link href="/register" passHref>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-spark-dark-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card className="premium-card">
                <CardHeader className="pb-2">
                  <Dumbbell className="h-8 w-8 text-spark-red-500 mb-2" />
                  <CardTitle>Personalized Workouts</CardTitle>
                  <CardDescription className="text-spark-silver-400">
                    Custom workout plans created by professional coaches.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-spark-silver-200">
                    Track your progress, log your sets and reps, and watch yourself grow stronger every day.
                  </p>
                </CardContent>
              </Card>
              <Card className="premium-card">
                <CardHeader className="pb-2">
                  <Flame className="h-8 w-8 text-spark-red-500 mb-2" />
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription className="text-spark-silver-400">
                    Visual progress tracking with photo uploads.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-spark-silver-200">
                    Upload progress pictures and see your transformation over time with detailed metrics.
                  </p>
                </CardContent>
              </Card>
              <Card className="premium-card">
                <CardHeader className="pb-2">
                  <Clock className="h-8 w-8 text-spark-red-500 mb-2" />
                  <CardTitle>Workout Timer</CardTitle>
                  <CardDescription className="text-spark-silver-400">
                    Built-in timer for rest periods and intervals.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-spark-silver-200">
                    Stay on track with our integrated workout timer to optimize your training sessions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-spark-dark-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl premium-text-gradient">
                  Ready to ignite your fitness?
                </h2>
                <p className="mx-auto max-w-[700px] text-spark-silver-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join Spark Fitness today and transform your workout experience.
                </p>
              </div>
              <Link href="/register" passHref>
                <Button className="premium-button">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

