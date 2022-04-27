import { getDataControllerByName, GridControllerButtons, loadDataController, SimpleHtmlGrid } from "@rad-tools";
import React, { useState } from "react";

export function Drum() {
    const [reload, setReload] = useState(true);
    const controllerName = "DRUM";
    const controller = getDataControllerByName(controllerName);

    if (!controller.gridInterface) {
        setTimeout(() => {
            loadDataController(controllerName).then(() => {
                setReload(reload ? false : true);
            });
        });
    } else {
        const gridInterface = controller.gridInterface;
        return (
            <div className="flex flex-row h-full mt-2 w-full">
                <div className="flex flex-col m-2">
                    <GridControllerButtons dataSet={controllerName} />
                </div>
                <SimpleHtmlGrid
                    className="simple-html-grid flex-grow m-3 mb-5"
                    interface={gridInterface}
                ></SimpleHtmlGrid>
            </div>
        );
    }
    return null;
}
