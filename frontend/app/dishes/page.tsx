"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ChefHat,
} from "lucide-react";
import Link from "next/link";
import { modifiedRespnse } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { DIET, Dish } from "@/lib/types";

export default function DishesPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<Dish[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterDiet, setFilterDiet] = useState("all");
  const [filterFlavor, setFilterFlavor] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchDishes();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [
    dishes,
    sortBy,
    sortOrder,
    filterDiet,
    filterFlavor,
    filterState,
    debouncedSearchTerm,
  ]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value immediately
    setSearchTerm(e.target.value);
  };

  const applyFiltersAndSort = () => {
    let filtered = [...dishes];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          dish.ingredients.some((ing) =>
            ing.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          dish.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filterDiet !== "all") {
      filtered = filtered.filter((dish) => dish.diet === filterDiet);
    }
    if (filterFlavor !== "all") {
      filtered = filtered.filter(
        (dish) => dish.flavor_profile === filterFlavor
      );
    }
    if (filterState !== "all") {
      filtered = filtered.filter((dish) => dish.state === filterState);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Dish];
      let bValue: any = b[sortBy as keyof Dish];

      if (typeof aValue === "string") {
        aValue = aValue?.toLowerCase();
        bValue = bValue?.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredDishes(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredDishes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDishes = filteredDishes.slice(startIndex, endIndex);

  const uniqueStates = [...new Set(dishes.map((dish) => dish.state))].sort();
  const uniqueFlavors = [
    ...new Set(dishes.map((dish) => dish.flavor_profile)),
  ].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dishes...</p>
        </div>
      </div>
    );
  }

  const generatePagination = (currentPage: number, totalPages: number) => {
    const delta = 2; // Number of pages to show around current page
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }
    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Dishes</h1>
          <p className="text-gray-600">
            Explore our complete collection of Indian dishes
          </p>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search</label>
                <Input
                  placeholder="Search dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Diet</label>
                <Select value={filterDiet} onValueChange={setFilterDiet}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="Non-Vegetarian">
                      Non-Vegetarian
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Flavor</label>
                <Select value={filterFlavor} onValueChange={setFilterFlavor}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueFlavors.map((flavor) => (
                      <SelectItem key={flavor} value={flavor}>
                        {flavor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">State</label>
                <Select value={filterState} onValueChange={setFilterState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="prep_time">Prep Time</SelectItem>
                      <SelectItem value="cook_time">Cook Time</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                  >
                    {sortOrder === "asc" ? "↑" : "↓"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredDishes.length)}{" "}
            of {filteredDishes.length} dishes
          </p>
        </div>

        {/* Dishes Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Diet</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Prep Time</TableHead>
                  <TableHead>Cook Time</TableHead>
                  <TableHead>Flavor</TableHead>
                  <TableHead>Ingredients</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDishes.map((dish) => (
                  <TableRow key={dish._id}>
                    <TableCell>
                      <Link
                        href={`/dish/${dish._id}`}
                        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {dish.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          dish.diet === DIET.VEG ? "default" : "destructive"
                        }
                      >
                        {dish.diet === DIET.VEG ? "Veg" : "Non-Veg"}
                      </Badge>
                    </TableCell>
                    <TableCell>{dish.course}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {dish.state}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {dish.prep_time}min
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                        {dish.cook_time}min
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{dish.flavor_profile}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {dish.ingredients
                          .slice(0, 2)
                          .map((ingredient, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {ingredient}
                            </Badge>
                          ))}
                        {dish.ingredients.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{dish.ingredients.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {generatePagination(currentPage, totalPages).map(
                (page, index) => {
                  if (page === "...") {
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        disabled
                        className="pointer-events-none"
                      >
                        ...
                      </Button>
                    );
                  }

                  return (
                    <Button
                      key={index}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                    >
                      {page}
                    </Button>
                  );
                }
              )}
            </div>

            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
