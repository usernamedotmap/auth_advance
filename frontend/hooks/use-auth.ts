"use client"

import { getUserSessionQueryFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const UseAuth = () => {

    const query = useQuery({
        queryKey: ["authUser"],
        queryFn: getUserSessionQueryFn,
        staleTime: Infinity,
    });

    return query;
};

export default UseAuth;