"use client";
import { useStore } from "@/store/store";
import React, { useEffect, useMemo, useState } from "react";
import { ProductProps } from "../../../type";
import Image from "next/image";
import Link from "next/link";
import { HiHeart, HiOutlineHeart } from "react-icons/hi";
import { ImStarEmpty, ImStarFull, ImStarHalf } from "react-icons/im";
import FormattedPrice from "../common/FormattedPrice";
import AddToCartBtn from "../common/AddToCartBtn";
import { useSearchParams } from "next/navigation";

export default function Products() {
    // Access the product state and fetchProduct function from the store
    const product = useStore((state) => state.product);
    const favorites = useStore((state) => state.favorites);
    const addToFavorites = useStore((state) => state.addToFavorites);
    const fetchProduct = useStore((state) => state.fetchProduct);
    const searchParams = useSearchParams();
    const filter = searchParams.getAll("filter");

    useEffect(() => {
        // Fetch product data on component mount
        fetchProduct();
    }, [fetchProduct]);

    const filteredProducts = useMemo(() => {
        let filteredProd: string[];
        // Check the filter type to apply the appropriate filtering logic
        if (filter[0] === "price") {
            // Filter products by price range
            filteredProd = product.filter(
                (item) =>
                    item[filter[0]] >= filter[1] && item[filter[0]] <= filter[2]
            );
        } else {
            filteredProd = product.filter(
                // Filter products by other criteria (like, category, brand)
                (item) => item[filter[0]] === filter[1]
            );
        }
        // Ensure that filtered products are returned if available; otherwise, return the original product list
        return filteredProd.length > 0 ? filteredProd : product;
    }, [product, filter]);

    const favoriteStyle =
        "w-9 ml:w-12 h-9 ml:h-12 absolute bottom-1 flex right-1 border-[1px] bg-white rounded-full\
        text-cPrimary shadow-md items-center justify-center text-lg ml:text-2xl hover:bg-cPrimary/10";

    return (
        <section className="flex justify-center">
            <div
                className="md:w-[90vw] grid grid-cols-2 md:grid-cols-3
                ls:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6"
            >
                {filteredProducts?.map(
                    ({
                        _id,
                        title,
                        brand,
                        category,
                        description,
                        image,
                        isNew,
                        oldPrice,
                        price,
                    }: ProductProps) => {
                        return (
                            <div
                                key={_id}
                                className="group  w-[180px] md:w-full bg-white/90 overflow-hidden
                                drop-shadow-xl hover:shadow-md rounded-lg"
                            >
                                <div className="w-full h-[180px] ml:h-[260px] relative border-b-2 mb-1">
                                    <Link
                                        href={{
                                            pathname: `/${_id}`,
                                            query: { _id, title },
                                        }}
                                    >
                                        <Image
                                            className="w-full h-full object-cover
                                            scale-90 hover:scale-100
                                            transition-transform duration-300"
                                            src={image}
                                            alt={title}
                                            width={300}
                                            height={300}
                                        />
                                    </Link>
                                    {/* Favorites */}
                                    <button
                                        onClick={() =>
                                            addToFavorites({
                                                _id,
                                                title,
                                                brand,
                                                category,
                                                description,
                                                image,
                                                isNew,
                                                oldPrice,
                                                price,
                                            })
                                        }
                                    >
                                        {/* Check if the current item is in favorites */}
                                        {favorites.find(
                                            (favoritesItem) =>
                                                favoritesItem._id === _id
                                        ) ? (
                                            <div className={favoriteStyle}>
                                                <HiHeart />
                                            </div>
                                        ) : (
                                            <div
                                                className={`${favoriteStyle} duration-300 md:translate-x-14 md:group-hover:translate-x-0`}
                                            >
                                                <HiOutlineHeart />
                                            </div>
                                        )}
                                    </button>
                                    {/* Discount */}
                                    {isNew && (
                                        <p
                                            className="absolute top-3 right-3
                                            text-cPrimary font-medium text-[0.6rem] ml:text-xs
                                            tracking-wide animate-bounce"
                                        >
                                            Save{" "}
                                            <FormattedPrice
                                                amount={oldPrice - price}
                                            />
                                        </p>
                                    )}
                                </div>
                                <div className="px-1.5 ml:px-3 pb-3 font-medium relative">
                                    {/* star */}
                                    {/* TODO: Render the stars dynamic */}
                                    <Link
                                        href="#"
                                        className="absolute right-1 top-0 text-[0.6rem] ml:text-sm
                                    flex text-cPrimary space-x-0.5"
                                    >
                                        <ImStarFull />
                                        <ImStarFull />
                                        <ImStarFull />
                                        <ImStarHalf />
                                        <ImStarEmpty />
                                    </Link>
                                    <p
                                        className="text-[0.6rem] ml:text-xs text-gray-600 px-1
                                    tracking-wide bg-cPrimary/10 rounded-sm w-fit"
                                    >
                                        {category}
                                    </p>
                                    <p className="ml:text-base ml:font-medium truncate text-sm font-normal">
                                        {title}
                                    </p>
                                    <p className="flex items-center gap-1 ml:gap-2">
                                        <span className="text-cPrimary font-medium ml:font-semibold text-sm ml:text-base">
                                            <FormattedPrice amount={price} />
                                        </span>
                                        <span className="text-xs ml:text-sm line-through">
                                            <FormattedPrice amount={oldPrice} />
                                        </span>
                                    </p>
                                    <p className="truncate text-xs ml:text-sm">
                                        {description}
                                    </p>
                                    {/* Add to cart */}
                                    <div className="w-full h-9 ml:h-12 my-1">
                                        <AddToCartBtn
                                            _id={_id}
                                            title={title}
                                            brand={brand}
                                            category={category}
                                            description={description}
                                            image={image}
                                            isNew={isNew}
                                            oldPrice={oldPrice}
                                            price={price}
                                            quantity={1}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }
                )}
            </div>
        </section>
    );
}
