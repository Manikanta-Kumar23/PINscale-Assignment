import { assign, createMachine } from "xstate"

export const FetchMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDEwBcAWBjAlgOygDoAZAewEMJ8oBiCUvMQ-AN1IGsnVNcCSKqBBK1JZyaHAwDaABgC6suYlAAHUrBwSGykAA9EARgBsAdkIBOAMwAWa+dvmArOZP3rAGhABPRAFpjAEyEAeYBRpaOMpYBjgYyABwmAL5JntzY1PyU1DRgAE55pHmEKgA24gBmRQC2hOm8RGTZQiJiWniKijpqGu06+gi+1vHB1pYmMkZRVgaOJvGePoMBZtYTJpZTY6auTilp6Bl8AJJ4mjjkpTTcWBhdSCA959oPA74BxoTxjo4B8QY2eIyWILbx+AwTQgySYyEwmIy-EzWIzmFKpEB4UgQOA6erUbrqZ54fp+ax-YLmIzWOIheYuAyLPxhIKmWFGUzhAIyMJGfYgPF8JqCKAE3qSYmvPyxQgmAIfWXI6lGAxWRmDCHWCxOEzOeyOKZyyx8gVEABKOIeTz6koQlnMMmCNkiZMcliByqMav8ZKhBgcwIRCTZxsODUI5oAVqKiSSEAYDCM7ZN3QCgXYAmr4kYZdSdWNLJZuQY5SGeJlTudLtHraA3m6HSEqTSXPF6V6IQ7-gFovFCx8Ua60UkgA */
    initial: "Initial",
    schema: {
        services: {} as {
            "fetchApi": {
                data: any
            }
        }
    },
    context: {
        fetchedData: {}
    },

    id: "Fethcing",
    tsTypes: {} as import("./index.typegen").Typegen0,

    states: {
        Loading: {
            invoke: {
                src: "fetchApi",

                onDone: {
                    target: "Res" ,
                    actions: assign({
                        fetchedData: (context , event) => event.data
                    })
                },

                onError: "Rej" 
            }
        },

        Res: {},
        Rej: {},
        Initial: {
            on: {
                Fetch: "Loading"
            }
        }
    }
 } , {
    services: {
        fetchApi: async (context , event: any) => {
            const res = await fetch(event.url , event.options)
            const data = await res.json()
            if (res.ok) {
                return data
            }
            else {
                throw new Error
            }
            
        }
    }
 })