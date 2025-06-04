"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ChefHat, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { modifiedRespnse } from "@/lib/utils";
import { DIET, Dish } from "@/lib/types";

export default function HomePage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Dish[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dishes");
      const { data } = await response.json();
      const modifiedData = modifiedRespnse(data);
      setDishes(modifiedData);
    } catch (error) {
      console.error("Error fetching dishes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length > 1) {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(term)}`
        );
        const { data } = await response.json();
        const modifiedData = modifiedRespnse(data);

        setSuggestions(modifiedData);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const featuredDishes = dishes?.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dishes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Indian Cuisine Explorer
              </h1>
            </div>

            {/* Search Box */}
            <div className="relative w-96">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search dishes, ingredients, or regions..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Search Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 mt-1">
                  {suggestions.slice(0, 5).map((dish) => (
                    <Link
                      key={dish._id}
                      href={`/dish/${dish._id}`}
                      className="block px-4 py-2 hover:bg-gray-50 border-b last:border-b-0"
                      onClick={() => setShowSuggestions(false)}
                    >
                      <div className="font-medium">{dish.name}</div>
                      <div className="text-sm text-gray-500">
                        {dish.state} • {dish.course}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover the Rich Flavors of India
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Explore authentic Indian recipes, find dishes based on your
            available ingredients, and learn about the diverse culinary
            traditions across different regions of India.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dishes">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Browse All Dishes
              </Button>
            </Link>
            <Link href="/ingredient-suggester">
              <Button size="lg" variant="outline">
                Find Dishes by Ingredients
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Dishes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Featured Dishes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDishes.map((dish) => (
              <Card
                key={dish._id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{dish.name}</CardTitle>
                    <Badge
                      variant={
                        dish.diet === DIET.VEG ? "default" : "destructive"
                      }
                    >
                      {dish.diet === DIET.VEG ? "Veg" : "Non-Veg"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center space-x-4 text-sm">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {dish.state}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {dish.cook_time}min
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Course:
                      </p>
                      <Badge variant="outline">{dish.course}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Key Ingredients:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {dish.ingredients
                          .slice(0, 3)
                          .map((ingredient, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        {dish.ingredients.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{dish.ingredients.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Link href={`/dish/${dish._id}`}>
                      <Button className="w-full mt-4" variant="outline">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {dishes.length}
              </div>
              <div className="text-gray-600">Total Dishes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {new Set(dishes.map((d) => d.state)).size}
              </div>
              <div className="text-gray-600">States Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {dishes.filter((d) => d.diet === DIET.VEG).length}
              </div>
              <div className="text-gray-600">Vegetarian Dishes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">
                {new Set(dishes.flatMap((d) => d.ingredients)).size}
              </div>
              <div className="text-gray-600">Unique Ingredients</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
