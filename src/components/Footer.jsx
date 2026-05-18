function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-8 mt-4 border-t border-[#1a1a1a] text-center text-[#808080] text-sm">
      <p>
        <span className="text-[#FF5733]">$</span>
        <span className="ml-2">echo "Thanks for visiting!"</span>
      </p>
      <p className="mt-2">© {currentYear} Soumya Das. All rights reserved.</p>
    </footer>
  )
}

export default Footer
