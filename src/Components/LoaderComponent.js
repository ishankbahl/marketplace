import { CircularProgress } from "@material-ui/core";

export default function LoaderComponent(props) {
    return (
        <CircularProgress {...props} className="text-indigo-500" />
    );
}