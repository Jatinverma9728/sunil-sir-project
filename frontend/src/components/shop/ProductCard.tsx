// "use client";

// import { Product } from "@/lib/api/products";
// import { formatCurrency } from "@/lib/utils";
// import { useCart } from "@/lib/context/CartContext";
// import Button from "../ui/Button";
// import { Card, CardContent, CardFooter } from "../ui/Card";
// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";

// interface ProductCardProps {
//     product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//     const { addToCart } = useCart();
//     const [isAdding, setIsAdding] = useState(false);

//     const handleAddToCart = (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsAdding(true);
//         addToCart(product, 1);

//         setTimeout(() => {
//             setIsAdding(false);
//         }, 1000);
//     };

//     const imageUrl = product.images?.[0]?.url || 'https://via.placeholder.com/300';

//     return (
//         <Link href={`/products/${product._id}`}>
//             <Card className="h-full hover:shadow-xl transition-shadow cursor-pointer group">
//                 <div className="relative h-48 overflow-hidden rounded-t-lg">
//                     <Image
//                         src={imageUrl}
//                         alt={product.title}
//                         fill
//                         className="object-cover group-hover:scale-110 transition-transform duration-300"
//                     />
//                     {!product.inStock && (
//                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                             <span className="text-white font-semibold">Out of Stock</span>
//                         </div>
//                     )}
//                 </div>

//                 <CardContent className="p-4">
//                     <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
//                         {product.title}
//                     </h3>

//                     <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//                         {product.description}
//                     </p>

//                     <div className="flex items-center gap-2 mb-3">
//                         <div className="flex items-center">
//                             {[...Array(5)].map((_, i) => (
//                                 <svg
//                                     key={i}
//                                     className={`w-4 h-4 ${i < Math.floor(product.rating.average)
//                                             ? "text-yellow-400"
//                                             : "text-gray-300"
//                                         }`}
//                                     fill="currentColor"
//                                     viewBox="0 0 20 20"
//                                 >
//                                     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                 </svg>
//                             ))}
//                             <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
//                                 ({product.rating.count})
//                             </span>
//                         </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                         <span className="text-2xl font-bold text-blue-600">
//                             {formatCurrency(product.price)}
//                         </span>
//                         {product.brand && (
//                             <span className="text-xs text-gray-500 dark:text-gray-400">
//                                 {product.brand}
//                             </span>
//                         )}
//                     </div>
//                 </CardContent>

//                 <CardFooter className="p-4 pt-0">
//                     <Button
//                         variant="primary"
//                         size="md"
//                         className="w-full"
//                         disabled={!product.inStock || isAdding}
//                         onClick={handleAddToCart}
//                     >
//                         {isAdding ? "Added!" : "Add to Cart"}
//                     </Button>
//                 </CardFooter>
//             </Card>
//         </Link>
//     );
// }
