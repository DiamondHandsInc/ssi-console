import { Component } from "solid-js";
import Panel from "../../../../components/Panel/Panel";

const TrustedDIDs: Component = () => {
    return (
        <Panel content={content["trusted"]} />
    )
}

export default TrustedDIDs;

const content = {
    trusted: {
        id: "trusted",
        title: "Trusted DIDs",
        listItems: [],
        fallback: "You haven't added any DIDs to your Trust Registry yet, so there's nothing here."
    },
}