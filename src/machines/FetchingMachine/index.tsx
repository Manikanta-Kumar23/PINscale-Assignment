import { assign, createMachine } from "xstate"

export const FetchMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDEwBcAWBjAlgOygDoAFAUQDkARASXIHEBiCAezzEPwDdmBrd1TLgIkKNegi7MsAQzQ5WAbQAMAXWUrEoAA7NYOOa00gAHogCMANgDshAJwBmACyPbz2wFZbV144A0IAE9EAFpLACZCMNswi3t3JXsw9zMlAA4rAF8M-wFsfCIyKlpGMAAnUuZSwi0AG1kAM0qAW0JcoQLRYok8bhkDPHV1Ix09fqNTBGDHVMjHeyslCwSHM3crVP8gybCbRwWreyW5628PLJz0POFaagAVagBBABkGASwMIaQQEf15PHGQmFLIRUu53GFUmYnKklMkNoEQmYFoQlIslFYrBZwVZHBZbOcQG18oQAMoAVQAwhTSCSSa90O9PtpdL9DF8JjsZuj7KkYWFHGt7PNNoCdoRrKC5uiwqilNMstkQHhmBA4EYiQRhiyxuyQo4IZFbBZHCkousvGYRZN7KtCEjJelnHiwQSNR0ivQtaM-gDJslCFYwkDA7iTRYzA4raEcXYPFZPK53Esg-ZXZd2qTKdTaV7Wf9dQg5u4A2alEaFk57K4o2YTSiLEs8fazDFA2nBMTkA9qE9czrQBMzGYZlXFjDwzy5dErakLAGTfG5kKlECg+2rkQbvdnn2fQXgpPDcbTV5Uhaa8jIWFEql7CvLB5UwqgA */
    initial: "INITIAL",
    schema: {
        services: {} as {
            "fetchApi": {
                data: any
            }
        }
    },
    context: {
        fetchedData: {} as any
    },

    id: "Fethcing",
    tsTypes: {} as import("./index.typegen").Typegen0,

    states: {
        PENDING: {
            invoke: {
                src: "fetchApi",

                onDone: {
                    target: "SUCCESS" ,
                    actions: assign({
                        fetchedData: (context , event) => event.data
                    })
                },

                onError: "FAIL" 
            }
        },

        SUCCESS: {
            on: {
                Fetch: "PENDING"
            }
        },
        FAIL: {},

        INITIAL: {
            on: {
                Fetch: "PENDING"
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
                throw new Error("Fetching Failed")
            }
            
        }
    }
 })