import type {
  Brand,
  Category,
  Coupon,
  Order,
  Product,
  Review,
  Testimonial
} from "@/models/domain";

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Microcontrollers",
    slug: "microcontrollers",
    description: "Arduino, ESP32, STM32 and edge AI boards.",
    icon: "Cpu",
    productCount: 148
  },
  {
    id: "cat-2",
    name: "Sensors",
    slug: "sensors",
    description: "Precision sensing for robotics and IoT builds.",
    icon: "Radar",
    productCount: 212
  },
  {
    id: "cat-3",
    name: "Power Modules",
    slug: "power-modules",
    description: "Buck, boost and battery management solutions.",
    icon: "BatteryCharging",
    productCount: 86
  },
  {
    id: "cat-4",
    name: "Tools & Kits",
    slug: "tools-kits",
    description: "Soldering, debugging and lab-ready kits.",
    icon: "Wrench",
    productCount: 97
  }
];

export const brands: Brand[] = [
  { id: "br-1", name: "Arduino", slug: "arduino", description: "Maker-first boards and shields." },
  { id: "br-2", name: "Raspberry Pi", slug: "raspberry-pi", description: "Edge compute and education hardware." },
  { id: "br-3", name: "Texas Instruments", slug: "texas-instruments", description: "Reliable analog and embedded parts." },
  { id: "br-4", name: "Adafruit", slug: "adafruit", description: "Creative learning hardware and modules." }
];

export const reviews: Review[] = [
  {
    id: "rev-1",
    author: "Aadhya Menon",
    rating: 5,
    comment: "Packaging was anti-static, delivery was fast, and the ESP32 boards tested perfectly on arrival.",
    role: "Robotics Club Lead",
    createdAt: "2026-04-14"
  },
  {
    id: "rev-2",
    author: "Rohit V",
    rating: 4,
    comment: "The component comparison and datasheet flow makes procurement far quicker than general marketplaces.",
    role: "Hardware Engineer",
    createdAt: "2026-04-28"
  },
  {
    id: "rev-3",
    author: "Krisha Patel",
    rating: 5,
    comment: "Bulk inquiry support helped our college team source matched sensors within budget.",
    role: "Embedded Systems Student",
    createdAt: "2026-05-07"
  }
];

export const products: Product[] = [
  {
    id: "prod-1",
    name: "ESP32 DevKit V1 Wi-Fi + Bluetooth Board",
    slug: "esp32-devkit-v1",
    shortDescription: "Dual-core IoT workhorse for prototyping wireless devices.",
    description:
      "A developer favorite for connected products, featuring dual-core performance, built-in Wi-Fi and Bluetooth, breadboard-friendly headers, and broad framework support from Arduino to ESP-IDF.",
    category: "Microcontrollers",
    brand: "Arduino",
    sku: "ZE-ESP32-V1",
    price: 499,
    compareAtPrice: 699,
    rating: 4.8,
    reviewCount: 184,
    stock: 63,
    stockState: "in-stock",
    featured: true,
    bestSeller: true,
    tags: ["wifi", "bluetooth", "iot"],
    images: [
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1563770660941-10a63607692e?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "MCU", value: "ESP32-D0WDQ6" },
      { label: "Clock Speed", value: "Up to 240 MHz" },
      { label: "Connectivity", value: "802.11 b/g/n, BLE 4.2" },
      { label: "Flash", value: "4 MB" }
    ],
    datasheetUrl: "/datasheets/esp32-devkit-v1.pdf"
  },
  {
    id: "prod-2",
    name: "MPU6050 6-Axis Gyroscope + Accelerometer",
    slug: "mpu6050-6-axis-module",
    shortDescription: "Balanced motion sensing for drones, wearables and control systems.",
    description:
      "Combines a 3-axis accelerometer and 3-axis gyroscope in a compact breakout with dependable I2C communication and low-noise performance for balancing, orientation, and motion capture.",
    category: "Sensors",
    brand: "Adafruit",
    sku: "ZE-MPU6050",
    price: 219,
    compareAtPrice: 299,
    rating: 4.6,
    reviewCount: 112,
    stock: 18,
    stockState: "low-stock",
    featured: true,
    bestSeller: false,
    tags: ["imu", "i2c", "drone"],
    images: [
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Sensor", value: "3-axis gyro + 3-axis accelerometer" },
      { label: "Protocol", value: "I2C" },
      { label: "Voltage", value: "3V - 5V" },
      { label: "Applications", value: "Stabilization, robotics, gesture systems" }
    ],
    datasheetUrl: "/datasheets/mpu6050.pdf"
  },
  {
    id: "prod-3",
    name: "LM2596 Adjustable DC-DC Buck Converter",
    slug: "lm2596-buck-converter",
    shortDescription: "Efficient step-down power board for bench and field builds.",
    description:
      "An adjustable switching regulator module with onboard trimmer, power indicator, and strong efficiency for battery systems, LED projects, robotics, and lab power experiments.",
    category: "Power Modules",
    brand: "Texas Instruments",
    sku: "ZE-LM2596",
    price: 149,
    compareAtPrice: 199,
    rating: 4.7,
    reviewCount: 89,
    stock: 124,
    stockState: "in-stock",
    featured: false,
    bestSeller: true,
    tags: ["power", "buck", "converter"],
    images: [
      "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Input Voltage", value: "4V - 40V" },
      { label: "Output Voltage", value: "1.25V - 35V" },
      { label: "Current", value: "Up to 3A" },
      { label: "Efficiency", value: "Up to 92%" }
    ],
    datasheetUrl: "/datasheets/lm2596.pdf"
  },
  {
    id: "prod-4",
    name: "Raspberry Pi Pico W Development Board",
    slug: "raspberry-pi-pico-w",
    shortDescription: "Compact wireless controller for education and product prototypes.",
    description:
      "Built on RP2040 with onboard Wi-Fi, this board is ideal for control loops, classroom labs, and connected prototypes that need dependable performance and excellent documentation.",
    category: "Microcontrollers",
    brand: "Raspberry Pi",
    sku: "ZE-PICO-W",
    price: 749,
    compareAtPrice: 899,
    rating: 4.9,
    reviewCount: 73,
    stock: 0,
    stockState: "out-of-stock",
    featured: true,
    bestSeller: true,
    tags: ["rp2040", "wifi", "education"],
    images: [
      "https://images.unsplash.com/photo-1591799265444-d66432b91588?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1555617117-08fda4f3cfb5?auto=format&fit=crop&w=1200&q=80"
    ],
    specifications: [
      { label: "Microcontroller", value: "RP2040 dual-core Arm Cortex-M0+" },
      { label: "Wireless", value: "2.4GHz 802.11n" },
      { label: "Memory", value: "264KB SRAM" },
      { label: "Storage", value: "2MB QSPI Flash" }
    ],
    datasheetUrl: "/datasheets/pico-w.pdf"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "t-1",
    name: "Manasvi Shah",
    role: "STEM Lab Founder",
    quote: "Z Electronics feels like a hardware-native startup platform, not a commodity catalog. That speed matters.",
    rating: 5
  },
  {
    id: "t-2",
    name: "Aarav Joseph",
    role: "Autonomous Systems Builder",
    quote: "The inventory signals and datasheet-first product pages helped us cut component sourcing time by half.",
    rating: 5
  },
  {
    id: "t-3",
    name: "Nethra Iyer",
    role: "Campus Innovation Cell",
    quote: "We ordered in bulk for workshops and the support quality felt premium all the way through dispatch.",
    rating: 5
  }
];

export const coupons: Coupon[] = [
  {
    code: "YM10",
    title: "Young Minds Launch Offer",
    discountType: "percentage",
    value: 10,
    minimumOrderValue: 999
  },
  {
    code: "PCB250",
    title: "Flat 250 off on kit orders",
    discountType: "fixed",
    value: 250,
    minimumOrderValue: 2499
  }
];

export const orders: Order[] = [
  {
    id: "order-1",
    number: "ZE-240519-8124",
    total: 1647,
    status: "shipped",
    paymentStatus: "paid",
    createdAt: "2026-05-15",
    eta: "2026-05-21",
    trackingNumber: "TRKZE128475",
    deliveryPartner: "BlueDart Express",
    items: [
      { productId: "prod-1", name: "ESP32 DevKit V1 Wi-Fi + Bluetooth Board", quantity: 2, price: 499 },
      { productId: "prod-2", name: "MPU6050 6-Axis Gyroscope + Accelerometer", quantity: 1, price: 219 },
      { productId: "prod-3", name: "LM2596 Adjustable DC-DC Buck Converter", quantity: 2, price: 149 }
    ],
    timeline: [
      { status: "ordered", label: "Ordered", date: "15 May, 11:04 AM", done: true, current: false },
      { status: "packed", label: "Packed", date: "15 May, 4:40 PM", done: true, current: false },
      { status: "shipped", label: "Shipped", date: "16 May, 9:10 AM", done: true, current: true },
      { status: "out-for-delivery", label: "Out for Delivery", date: "Expected 21 May", done: false, current: false },
      { status: "delivered", label: "Delivered", date: "Pending", done: false, current: false }
    ]
  }
];
