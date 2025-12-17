<template>
  <section id="contact" class="flex flex-col gap-2">
    <SectionTitle>Get in Contact</SectionTitle>

    <p class="text-xl text-black-primary dark:text-white-primary">
      Feel free to email me at
    </p>

    <div>
      <div class="my-2 flex items-center gap-2">
        <IconsEmail height="20" width="20" />

        <a
          class="text-xl text-black-primary underline dark:text-white-primary"
          href="mailto:anewma6@clemson.edu"
          >anewma6@clemson.edu</a
        >
      </div>

      <div class="mb-4 flex items-center gap-2">
        <IconsPin height="20" width="20" />

        <p class="text-xl text-black-primary dark:text-white-primary">
          Clemson, South Carolina, USA
        </p>
      </div>
    </div>

    <div class="flex gap-4">
      <GithubLink />

      <LinkedInLink />
    </div>
  </section>
</template>
