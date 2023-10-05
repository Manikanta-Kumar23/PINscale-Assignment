import {render , fireEvent , screen} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"
import Login from "../../components/Login"
import {rest} from "msw"
import {setupServer} from "msw/node"

const server = setupServer(
    rest.post("/login" , (req , res , ctx) => {
        return res(ctx.status(200))
    })
)
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())



test("displays Home Component" , async () => {
    render(<Login />)
    userEvent.type(screen.getByPlaceholderText(/Email ID/i) , "jane.doe@gmail.com")
    userEvent.type(screen.getByPlaceholderText(/Password/i) , "janedoe@123")
    fireEvent.click(screen.getByText("Login"))
    await screen.findByAltText("logo")
})