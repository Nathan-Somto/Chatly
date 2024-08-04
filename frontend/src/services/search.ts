import { SearchDataResponse } from '@/api-types';
import { useGetQuery } from '@/hooks/query/useGetQuery'
import React from 'react'
type Props = {
    keyword: string;
    usersOnly: boolean;
}
export default function Search({keyword, usersOnly}: Props) {
    const {data: searchData, refetch, isError, isPending} = useGetQuery<SearchDataResponse>({
        enabled: true,
        queryKey: ['search'],
        route: `/search?keyword=${keyword}&usersOnly${usersOnly}`,
        displayToast: false
    })
    return {
        searchData,
        refetch,
        isError,
        isPending
    }
}
