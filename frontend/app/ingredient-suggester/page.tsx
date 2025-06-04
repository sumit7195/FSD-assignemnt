"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ChefHat, Search, X, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { modifiedRespnse } from "@/lib/utils";
import { DIET, Dish } from "@/lib/types";


export default function IngredientSuggesterPage() {
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [suggestedDishes, setSuggestedDishes] = useState<Dish[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIngredients();
  }, []);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      fetchSuggestedDishes();
    } else {
      setSuggestedDishes([]);
    }
  }, [selectedIngredients]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredIngredients(
        allIngredients.filter(
          (ingredient) =>
            ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !selectedIngredients.includes(ingredient)
        )
      );
    } else {
      setFilteredIngredients(
        allIngredients.filter(
          (ingredient) => !selectedIngredients.includes(ingredient)
        )
      );
    }
  }, [searchTerm, allIngredients, selectedIngredients]);

  const fetchIngredients = async () => {
    try {
      const response = await fetch("/api/ingredients");
      const data = await response.json();
      setAllIngredients(data);
      setFilteredIngredients(data);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestedDishes = async () => {
    try {
      const response = await fetch("/api/suggest-dishes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });
      const { data } = await response.json();
      const modifiedData = modifiedRespnse(data);

      setSuggestedDishes(modifiedData);
    } catch (error) {
      console.error("Error fetching suggested dishes:", error);
    }
  };

  console.log("Data ", suggestedDishes, selectedIngredients);
  const handleIngredientToggle = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient)
        ? prev.filter((item) => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.filter((item) => item !== ingredient)
    );
  };

  const clearAllIngredients = () => {
    setSelectedIngredients([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ingredients...</p>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dish Suggester
          </h1>
          <p className="text-gray-600">
            Select the ingredients you have available, and we'll suggest dishes
            you can make!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredient Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Available Ingredients</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search ingredients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredIngredients.slice(0, 50).map((ingredient) => (
                    <div
                      key={ingredient}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={ingredient}
                        checked={selectedIngredients.includes(ingredient)}
                        onCheckedChange={() =>
                          handleIngredientToggle(ingredient)
                        }
                      />
                      <label
                        htmlFor={ingredient}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {ingredient}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Selected Ingredients & Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selected Ingredients */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Selected Ingredients ({selectedIngredients.length})
                  </CardTitle>
                  {selectedIngredients.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearAllIngredients}
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {selectedIngredients.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No ingredients selected. Choose ingredients from the left
                    panel to get dish suggestions.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedIngredients.map((ingredient) => (
                      <Badge
                        key={ingredient}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1"
                      >
                        {ingredient}
                        <button
                          onClick={() => removeIngredient(ingredient)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Dishes */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Suggested Dishes ({suggestedDishes.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {suggestedDishes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    {selectedIngredients.length === 0
                      ? "Select ingredients to see dish suggestions"
                      : "No dishes found with the selected ingredients. Try adding more ingredients or different combinations."}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {suggestedDishes.map((dish) => (
                      <div
                        key={dish._id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <Link
                              href={`/dish/${dish._id}`}
                              className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {dish.name}
                            </Link>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {dish.state}
                              </span>
                              <span className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {dish.cook_time}min
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <Badge
                              variant={
                                dish.diet === DIET.VEG
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {dish.diet === DIET.VEG ? "Veg" : "Non-Veg"}
                            </Badge>
                            <Badge variant="outline">{dish.course}</Badge>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">
                              Required Ingredients:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {dish.ingredients.map((ingredient, index) => (
                                <Badge
                                  key={index}
                                  variant={
                                    selectedIngredients
                                      .map((item) => item.toLowerCase())
                                      .includes(ingredient.toLowerCase().trim())
                                      ? "default"
                                      : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {ingredient}
                                  {selectedIngredients
                                    .map((item) => item.toLowerCase())
                                    .includes(
                                      ingredient.toLowerCase().trim()
                                    ) && " ✓"}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">
                                {
                                  dish.ingredients.filter((ing) =>
                                    selectedIngredients
                                      .map((item) => item.toLowerCase())
                                      .includes(ing.toLowerCase().trim())
                                  ).length
                                }
                              </span>
                              {" of "}
                              <span className="font-medium">
                                {dish.ingredients.length}
                              </span>
                              {" ingredients available"}
                            </div>
                            <Link href={`/dish/${dish._id}`}>
                              <Button size="sm" variant="outline">
                                View Recipe
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
