export default function LoginPage() {
    return (
        <div>
            <form action="">
                <label htmlFor="">Username or email</label>
                <input
                    type="text"
                    placeholder="Enter your username or email here..."
                />
                <br />
                <label htmlFor="">password</label>
                <input type="password" placeholder="Enter your password" />
            </form>
        </div>
    );
}
