import {FC} from "react"
import {Skeleton} from "@gravity-ui/uikit"
import css from "./TableLoader.module.scss"

type TableLoaderProps = {
    rows: number;
}


export const TableLoader: FC<TableLoaderProps> = (props) => {
    const {rows} = props;

    return (
        <table className={css.TableLoader}>
            <thead>
                <tr className={css.TableLoader__field}>
                    <Skeleton className={css.TableLoader__field}></Skeleton>
                </tr>
            </thead>
            <tbody>
                {Array.from({length: rows}).map(() => (
                    <tr className={css.TableLoader__row}>
                        <th className={css.TableLoader__cell}>
                            <Skeleton className={css.TableLoader__skeleton}></Skeleton>
                        </th>
                    </tr>
                ))}

            </tbody>
        </table>
    )
}