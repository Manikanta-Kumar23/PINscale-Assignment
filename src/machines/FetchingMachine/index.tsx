import { assign, createMachine } from "xstate"

export const FetchMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDEwBcAWBjAlgOygDoAFAUQDkARASXIHEBiCAezzEPwDdmBrd1TLgIkKNegi7MsAQzQ5WAbQAMAXWUrEoAA7NYOOa00gAHogCMANgDshAJwBmACyPbz2wFZbV144A0IAE9EAFpLACZCMNswi3t3JXsw9zMlAA4rAF8M-wFsfCIyKlpGMAAnUuZSwi0AG1kAM0qAW0JcoQLRYok8bhkDPHV1Ix09fqNTBGDHVMjHeyslCwSHM3crVP8gybCbRwWreyW5628PLJz0POFaagAVagBBABkGASwMIaQQEf15PHGQmFLIRUu53GFUmYnKklMkNoEQmYFoQlIslFYrBZwVZHBZbFlsiA8MwIHAjG18sNdL9DF8JlMIZFbBZHCkousvGZNoCLBEXGsBVZ3I4lHtziAKcJCmI6FTRn8AZNkoQrGEgarcayLGYHNzJkjHHYPELbK53Es1fZxZKiABlACqAGFHaRbba5TT-nTEPZbEpIk54o4kvYYdqLHrQsGUWY3LCsWl0RZrZd2q0HtQnh6xt6EGYzDNfYsw1CYS4wnrUhYVayhXN7PYlEC1SnBPlCDd7s9swrc8FQ-6oiy2V5UpzI0j-ZCwolUo2gXj3FaCUA */
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

        SUCCESS: {},
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
                throw new Error
            }
            
        }
    }
 })