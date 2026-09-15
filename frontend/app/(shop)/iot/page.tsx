import type { Metadata } from "next";
import IoTClient from "./iot-client";
import type { Product } from "@/lib/api/products";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.northtechhub.in";

export const metadata: Metadata = {
    title: "IoT Boards, Raspberry Pi, Sensors & Robotics Kits India | North Tech Hub",
    description: "Shop genuine ESP32, ESP8266, Raspberry Pi 4B/3B+, Arduino headers, wireless telemetry modules, sensors, and robotics DIY kits with fast pan-India shipping.",
    keywords: [
        "buy IoT components India",
        "ESP32 development board",
        "Raspberry Pi 4B price India",
        "Arduino sensors and modules",
        "robotics DIY kits",
        "SIM800L module",
        "ESP8266 Wi-Fi",
        "North Tech Hub IoT"
    ],
    openGraph: {
        title: "IoT, Raspberry Pi & Robotics Kits India | North Tech Hub",
        description: "Explore genuine microcontrollers, maker boards, and robotics components.",
        url: `${SITE_URL}/iot`,
        type: "website"
    }
};

async function getInitialIoTProducts(): Promise<Product[]> {
    try {
        const res = await fetch(`${API_URL}/products?category=iot,raspberry-pi,diy-kits,rfid,drone-kit,3d-printer&limit=40`, {
            next: { revalidate: 1800 },
        });
        if (!res.ok) return [];

        const data = await res.json();
        if (!data.success || !Array.isArray(data.data)) return [];

        return data.data;
    } catch {
        return [];
    }
}

export default async function IoTPage() {
    const products = await getInitialIoTProducts();

    const collectionSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "IoT, Raspberry Pi & Robotics Gear India",
        url: `${SITE_URL}/iot`,
        description: "Explore genuine microcontrollers, development boards, and robotics components at North Tech Hub.",
        isPartOf: {
            "@type": "WebSite",
            name: "North Tech Hub",
            url: SITE_URL,
        },
        mainEntity: {
            "@type": "ItemList",
            itemListElement: products.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                url: `${SITE_URL}/products/${item._id}`,
                name: item.title,
                image: item.images?.[0]?.url,
            })),
        },
    };

    return (
        <>
            <script
                id="iot-collection-jsonld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
            />
            <IoTClient initialProducts={products} totalCount={products.length} />
        </>
    );
}
