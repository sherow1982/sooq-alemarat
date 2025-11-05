import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "./",
  },
  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "./",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "products",
        label: "المنتجات",
        path: "data",
        format: "json",
        ui: {
          filename: {
            readonly: true,
            slugify: () => {
              return "uae-products";
            },
          },
        },
        fields: [
          {
            name: "products",
            label: "قائمة المنتجات",
            type: "object",
            list: true,
            fields: [
              {
                name: "id",
                label: "معرف المنتج",
                type: "string",
                required: true,
              },
              {
                name: "title",
                label: "اسم المنتج",
                type: "string",
                required: true,
              },
              {
                name: "description",
                label: "وصف المنتج",
                type: "rich-text",
                required: true,
              },
              {
                name: "category",
                label: "الفئة",
                type: "string",
                required: true,
              },
              {
                name: "brand",
                label: "العلامة التجارية",
                type: "string",
                required: true,
              },
              {
                name: "regular_price",
                label: "السعر العادي",
                type: "number",
                required: true,
              },
              {
                name: "sale_price",
                label: "سعر البيع",
                type: "number",
                required: true,
              },
              {
                name: "currency",
                label: "العملة",
                type: "string",
                required: true,
              },
              {
                name: "discount_percentage",
                label: "نسبة الخصم",
                type: "number",
              },
              {
                name: "stock_status",
                label: "حالة المخزون",
                type: "string",
                options: ["in stock", "out of stock", "pre-order"],
                required: true,
              },
              {
                name: "condition",
                label: "حالة المنتج",
                type: "string",
                options: ["new", "used", "refurbished"],
                required: true,
              },
              {
                name: "image_url",
                label: "رابط الصورة",
                type: "image",
                required: true,
              },
              {
                name: "seo_title",
                label: "عنوان SEO",
                type: "string",
              },
              {
                name: "meta_description",
                label: "وصف ميتا",
                type: "string",
              },
              {
                name: "seo_keywords",
                label: "كلمات SEO المفتاحية",
                type: "string",
              },
              {
                name: "url_slug",
                label: "رابط URL",
                type: "string",
              },
              {
                name: "average_rating",
                label: "متوسط التقييم",
                type: "number",
              },
              {
                name: "review_count",
                label: "عدد المراجعات",
                type: "number",
              },
              {
                name: "has_variants",
                label: "يحتوي على متغيرات",
                type: "boolean",
              },
              {
                name: "free_shipping_threshold",
                label: "حد الشحن المجاني",
                type: "number",
              },
              {
                name: "delivery_time",
                label: "وقت التسليم",
                type: "string",
              },
              {
                name: "cod_available",
                label: "الدفع عند الاستلام متاح",
                type: "boolean",
              },
              {
                name: "uae_compliant",
                label: "متوافق مع الإمارات",
                type: "boolean",
              },
              {
                name: "material",
                label: "المادة",
                type: "string",
              },
            ],
          },
        ],
      },
      {
        name: "pages",
        label: "الصفحات",
        path: "pages",
        format: "md",
        fields: [
          {
            name: "title",
            label: "العنوان",
            type: "string",
            required: true,
          },
          {
            name: "description",
            label: "الوصف",
            type: "string",
          },
          {
            name: "body",
            label: "المحتوى",
            type: "rich-text",
            isBody: true,
          },
        ],
      },
      {
        name: "config",
        label: "إعدادات الموقع",
        path: "config",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            name: "site_name",
            label: "اسم الموقع",
            type: "string",
            required: true,
          },
          {
            name: "site_description",
            label: "وصف الموقع",
            type: "string",
          },
          {
            name: "site_url",
            label: "رابط الموقع",
            type: "string",
          },
          {
            name: "contact_email",
            label: "البريد الإلكتروني للتواصل",
            type: "string",
          },
          {
            name: "phone_number",
            label: "رقم الهاتف",
            type: "string",
          },
          {
            name: "social_media",
            label: "وسائل التواصل الاجتماعي",
            type: "object",
            fields: [
              {
                name: "facebook",
                label: "فيسبوك",
                type: "string",
              },
              {
                name: "instagram",
                label: "إنستغرام",
                type: "string",
              },
              {
                name: "twitter",
                label: "تويتر",
                type: "string",
              },
              {
                name: "whatsapp",
                label: "واتساب",
                type: "string",
              },
            ],
          },
        ],
      },
    ],
  },
});