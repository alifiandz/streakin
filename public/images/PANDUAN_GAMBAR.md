# Direktori Gambar Materi Latihan & Skill

Letakkan file gambar atau ilustrasi gerakan di folder ini:

1. **`public/images/exercises/`**
   - Contoh file: `pushup.jpg`, `tuck-lsit.png`, `wall-handstand.webp`
   - Path URL di kode: `/images/exercises/pushup.jpg`

2. **`public/images/skills/`**
   - Contoh file: `lsit-stage1.jpg`, `handstand-stage5.png`
   - Path URL di kode: `/images/skills/lsit-stage1.jpg`

### Cara Menghubungkannya ke Materi:
Buka file `lib/seedData.ts` dan tambahkan properti `imageUrl`:

```typescript
// Contoh pada SEED_EXERCISES:
{
  id: 'pushup',
  nama: 'Push-Up Standar',
  area: 'Dada & Triceps',
  imageUrl: '/images/exercises/pushup.jpg', // <--- Tambahkan baris ini
  ...
}

// Contoh pada Stage Skill di SEED_SKILLS:
{
  stageNumber: 1,
  nama: 'Support Hold',
  imageUrl: '/images/skills/lsit-stage1.jpg', // <--- Tambahkan baris ini
  ...
}
```

Format yang didukung: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.svg`.
Rasio gambar terbaik: **16:9** (landscape).

