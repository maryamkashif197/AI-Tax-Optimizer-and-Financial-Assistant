import matplotlib.pyplot as plt

def visualize_tax_savings():
    """Visualize tax savings by category using Matplotlib."""
    categories = ["Business", "Education", "Healthcare", "Entertainment"]
    savings = [200, 150, 100, 50]
    
    plt.figure(figsize=(10, 6))
    plt.bar(categories, savings, color=['green', 'blue', 'purple', 'red'])
    plt.xlabel("Category")
    plt.ylabel("Potential Tax Savings ($)")
    plt.title("AI-Generated Tax Savings Report")
    plt.grid(axis='y', linestyle='--', alpha=0.7)
    plt.show()