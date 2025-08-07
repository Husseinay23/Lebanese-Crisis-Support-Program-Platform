// components/ui/table.jsx
export function Table({ children }) {
    return <table className="min-w-full table-auto">{children}</table>;
  }
  
  export function TableHead({ children }) {
    return <thead className="bg-primary text-white">{children}</thead>;
  }
  
  export function TableBody({ children }) {
    return <tbody>{children}</tbody>;
  }
  
  export function TableRow({ children }) {
    return <tr className="border-b">{children}</tr>;
  }
  
  export function TableCell({ children }) {
    return <td className="py-2 px-4">{children}</td>;
  }
  