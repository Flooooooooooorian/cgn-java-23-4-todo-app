import {Navigate, Outlet} from "react-router-dom";

type ProtectedRouteProps = {
    user: string | undefined
}
export default function ProtectedRoute(props: ProtectedRouteProps) {

    const isAuthenticated: boolean = props.user !== 'anonymousUser'

    return (
        isAuthenticated ? <Outlet /> : <Navigate to={"/login"} />
    )
}
