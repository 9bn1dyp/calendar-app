'use client'

import { useState } from "react";
import { Button, ButtonProps } from "./ui/button";
import { Copy, CopyCheck, CopyX } from "lucide-react";

type CopyState =  "idle" | "copied" | "error"

export function CopyEventButton({ eventId, clerkUserId, ...buttonProps  } : Omit<ButtonProps, "children" | "onClick"> & {
    eventId: string; clerkUserId: string
} ) {   

    // track state of copy
    const [copyState, setCopyState] = useState<CopyState>("idle")
    // component form lucid, diff icons depending on state
    const CopyIcon = getCopyIcon(copyState)

    return (
        // onclick set clipboard to event link, then timeout and switch copy state back to idle
        // render the icon from copyIcon and text form func below
        <Button {...buttonProps} onClick={() => {
            navigator.clipboard.writeText(`${location.origin}/book/${clerkUserId}/${eventId}`)
            .then(() => {
                setCopyState("copied")
                setTimeout(() => setCopyState("idle"), 2000)
            }).catch(() => {
                setCopyState("error")
                setTimeout(() => setCopyState("idle"), 2000)
            })
        }}>
            <CopyIcon className="size-4 mr-2"/>
            {getChildren(copyState)}
        </Button>
    )
}

// get Icon based on copy state
function getCopyIcon(copyState: CopyState) {
    switch (copyState) {
        case "idle":
            return Copy
        case "copied":
            return CopyCheck
        case "error":
            return CopyX
    }
}

// copy text based on stateso 
function getChildren(copyState: CopyState) {
    switch (copyState) {
        case "idle":
            return "Copy Link"
        case "copied":
            return "Copied!"
        case "error":
            return "Error"
    }
}