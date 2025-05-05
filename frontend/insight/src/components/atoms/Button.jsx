export const Button = ({ onClick, disabled, loading, children, className = '', ...props }) => {
    return (
        <button onClick={onClick} disabled={disabled} className={className} {...props}>
            {loading ? "Yükleniyor" :  children} 
        </button>
    )
}
