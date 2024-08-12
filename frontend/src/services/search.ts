import { SearchDataResponse } from '@/api-types';
import { useGetQuery } from '@/hooks/query/useGetQuery'
type Props = {
    keyword: string;
    usersOnly: boolean;
    enabled?: boolean;
}
export default function Search({keyword, usersOnly, enabled= true}: Props) {
    const {data: searchData, refetch, isError, isPending, ...rest} = useGetQuery<SearchDataResponse>({
        enabled,
        queryKey: ['search'],
        route: `/search?keyword=${keyword}&usersOnly=${usersOnly}`,
        displayToast: false
    })
    return {
        searchData,
        refetch,
        isError,
        isPending,
        ...rest
    }
}
