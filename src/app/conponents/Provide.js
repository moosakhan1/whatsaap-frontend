"use client"
import NiceModal from "@ebay/nice-modal-react";

export default function Provider({children}){
    return(
        <NiceModal.Provider>
        <div>
            {children}
        </div>
        </NiceModal.Provider>
    )
}