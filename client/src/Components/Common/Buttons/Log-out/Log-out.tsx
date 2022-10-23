import './Log-out.scss';

const LogOut = () => {
    const handleLogOut = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <button className="log-out" onClick={handleLogOut}>
            Log out
        </button>
    );
};

export default LogOut;
