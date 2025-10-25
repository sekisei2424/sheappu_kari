"use client";

import MainLayout from "./(main)/layout";
import HomePage from "./(main)/page";

export default function RootHomeWithMainLayout() {
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
}
