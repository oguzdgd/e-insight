import { create } from "zustand";
import {persist} from "zustand/middleware"

const useModeStore = create(

    persist(

        (set)=>({
            mode:'user',
            setMode:(mode) =>set({mode})
        }),
        {name:'mode-store'}
    )
)
export default useModeStore