import { ApiLoader, getDataControllerByName, GridControllerButtons, SimpleHtmlGrid } from "@rad-tools";
import React, { useEffect, useState } from "react";
import { ApiInterface } from "@rad-common";

export function Api() {
    const controllerName = "WEB_REST_API";
    return (
        <ApiLoader
            controllerName={controllerName}
            callback={(controller) => {
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
                        <Details controllerName={controllerName} />
                    </div>
                );
            }}
        ></ApiLoader>
    );
}

export function Details(props: { controllerName: string }) {
    const [data, setData] = useState({} as { NAME: string; DATA: ApiInterface });
    const controller = getDataControllerByName(props.controllerName);
    const dataSource = controller.dataSource;

    type Details = { NAME: string; DATA: any };

    useEffect(() => {
        const datahandler = (e: { type: string; data: any }) => {
            if (e?.type === "currentEntity") {
                // generate new obj, so state see change
                const obj = {} as Details;
                obj.NAME = dataSource.currentEntity?.NAME;
                obj.DATA = dataSource.currentEntity?.DATA;

                setData(obj);
            }
        };

        dataSource.addEventListener(datahandler);

        return () => {
            dataSource.removeEventListener(datahandler);
        };
    });

    return (
        <div className="flex flex-col m-2 flex-1">
            <span>{data?.NAME}</span>
        </div>
    );
}
