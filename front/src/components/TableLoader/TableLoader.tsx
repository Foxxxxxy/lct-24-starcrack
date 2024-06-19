import {FC} from "react"
import {Skeleton} from "@gravity-ui/uikit"
import css from "./TableLoader.module.scss"

type TableLoaderProps = {
    rows: number;
}


export const TableLoader: FC<TableLoaderProps> = (props) => {
    const {rows} = props;

    return (
        <div className={css.TableLoader}>
            {Array.from({length: rows}).map((_, index: number) => (
                <div key={index} className={css.TableLoader__row}>
                    <div className={css.TableLoader__cell}>
                        <Skeleton className={css.TableLoader__skeleton}></Skeleton>
                    </div>
                </div>
            ))}
        </div>
    )
}