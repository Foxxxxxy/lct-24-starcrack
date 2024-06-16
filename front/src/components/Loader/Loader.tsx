import {FC} from "react";
import {Spin} from "@gravity-ui/uikit";

import css from "./Loader.module.scss";

export const Loader: FC = () => {
    return (
        <div className={css.LoaderContainer}>
            <Spin />
        </div>
    );
};