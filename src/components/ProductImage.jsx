export default function ProductImage({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      width="320"
      height="320"
      style={{
        objectFit: "cover",
        borderRadius: "12px"
      }}
    />
  );
}
