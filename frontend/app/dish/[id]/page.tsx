"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, ChefHat, ArrowLeft, Utensils } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { modifiedRespnse } from "@/lib/utils";
import { DIET, Dish } from "@/lib/types";

export default function DishDetailPage() {
  const params = useParams();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  console.log("params", params);

  useEffect(() => {
    if (params.id) {
      fetchDish(params.id as string);
    }
  }, [params.id]);

  const fetchDish = async (id: string) => {
    console.log("fetchDish", id);
    try {
      const response = await fetch(`/api/dishes/${id}`);
      if (response.ok) {
        const { data } = await response.json();
        const modifiedData = {
          ...data,
          ingredients: data.ingredients.split(","),
        };
        setDish(modifiedData);
      } else {
        console.error("Dish not found");
      }
    } catch (error) {
      console.error("Error fetching dish:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dish details...</p>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Dish Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The dish you're looking for doesn't exist.
          </p>
          <Link href="/dishes">
            <Button>Back to All Dishes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-orange-600" />
            <Link
              href="/"
              className="text-2xl font-bold text-gray-900 hover:text-orange-600"
            >
              Indian Cuisine Explorer
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/dishes">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Dishes
            </Button>
          </Link>
        </div>

        {/* Dish Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{dish.name}</h1>
            <Badge
              variant={dish.diet === DIET.VEG ? "default" : "destructive"}
              className="text-lg px-3 py-1"
            >
              {dish.diet === DIET.VEG ? "Vegetarian" : "Non-Vegetarian"}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-gray-600">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {dish.state}, {dish.region}
              </span>
            </div>
            <div className="flex items-center">
              <Utensils className="h-5 w-5 mr-2" />
              <span>{dish.course}</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {dish.flavor_profile}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ChefHat className="h-5 w-5 mr-2" />
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dish.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 bg-gray-50 rounded-lg border"
                    >
                      <div className="w-2 h-2 bg-orange-600 rounded-full mr-3"></div>
                      <span className="font-medium">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Dish Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Origin</h4>
                    <p className="text-gray-600">
                      {dish.state}, {dish.region}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Course Type
                    </h4>
                    <Badge variant="outline">{dish.course}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Flavor Profile
                    </h4>
                    <Badge variant="outline">{dish.flavor_profile}</Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Diet Type
                    </h4>
                    <Badge
                      variant={dish.diet === DIET.VEG ? "default" : "destructive"}
                    >
                      {dish.diet}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Timing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Timing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-blue-900">Prep Time</span>
                  <span className="text-blue-700 font-bold">
                    {dish.prep_time} min
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-green-900">Cook Time</span>
                  <span className="text-green-700 font-bold">
                    {dish.cook_time} min
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <span className="font-medium text-orange-900">
                    Total Time
                  </span>
                  <span className="text-orange-700 font-bold">{Number(dish.prep_time) + Number(dish?.cook_time)} min</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/ingredient-suggester" className="block">
                  <Button className="w-full" variant="outline">
                    Find Similar Dishes
                  </Button>
                </Link>
                <Link href="/dishes" className="block">
                  <Button className="w-full" variant="outline">
                    Browse More Dishes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Did You Know */}
            <Card>
              <CardHeader>
                <CardTitle>Did You Know?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <p>
                    <strong>{dish.name}</strong> is a traditional dish from{" "}
                    {dish.state}, known for its{" "}
                    {dish?.flavor_profile?.toLowerCase()} flavor profile.
                  </p>
                  <p>
                    This {dish.course.toLowerCase()} dish typically takes about{" "}
                    {Math.floor(
                      (Number(dish.prep_time) + Number(dish.cook_time)) / 60
                    ) > 0
                      ? `${Math.floor(
                          Number(dish.prep_time) + Number(dish.cook_time) / 60
                        )} hour(s) and `
                      : ""}
                    {(Number(dish.prep_time) + Number(dish.cook_time)) % 60}{" "}
                    minutes to prepare and cook.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
