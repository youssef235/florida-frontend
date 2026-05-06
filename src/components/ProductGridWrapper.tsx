import React, { ReactElement, useCallback, useEffect, useState } from "react";
import customFetch from "../axios/custom";
import { useAppDispatch } from "../hooks";
import {
  setShowingProducts,
  setTotalProducts,
} from "../features/shop/shopSlice";

interface WrapperProps {
  searchQuery?: string;
  sortCriteria?: string;
  category?: string;
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  children: ReactElement;
}

const ProductGridWrapper = ({
  searchQuery,
  sortCriteria,
  category,
  page = 1,
  limit = 9,
  minPrice,
  maxPrice,
  hasDiscount,
  children,
}: WrapperProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const dispatch = useAppDispatch();

  const getProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();

      // 🔍 Search
      if (searchQuery) {
        params.append("keyword", searchQuery);
      }

      // 📂 Category (FIXED)
      if (category && category !== "all") {
        params.append("category", category);
      }

      // 💰 Price filter
      if (minPrice !== undefined) {
        params.append("minPrice", String(minPrice));
      }

      if (maxPrice !== undefined) {
        params.append("maxPrice", String(maxPrice));
      }

      // 🔥 Discount
      if (hasDiscount) {
        params.append("hasDiscount", "true");
      }

      // 🔃 Sort
      if (sortCriteria) {
        params.append("sort", sortCriteria);
      }

      // 📄 Pagination (IMPORTANT FIX)
      params.append("page", String(page));
      params.append("pageSize", String(limit));

      const response = await customFetch.get(
        `/products?${params.toString()}`
      );

      const fetchedProducts = response.data.data;
      const meta = response.data.meta;

      // 📊 Redux stats
      dispatch(setTotalProducts(meta?.total || 0));
      dispatch(setShowingProducts(fetchedProducts.length));

      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }, [
    searchQuery,
    sortCriteria,
    category,
    page,
    limit,
    minPrice,
    maxPrice,
    hasDiscount,
    dispatch,
  ]);

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // ❌ FIX: no cloneElement typing issue anymore (safe cast)
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return null;

    return React.cloneElement(child as React.ReactElement<any>, {
      products,
      variant: "detailed",
    });
  });

  return <>{childrenWithProps}</>;
};

export default ProductGridWrapper;