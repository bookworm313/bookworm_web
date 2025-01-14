<template>
    <aside class="sidebar">
        <img src="../assets/images/bookworm-logo.svg" alt="Logo" class="logo" />
        <hr />
        <nav>
            <ul>
                <li v-for="section in sections" :key="section.label">
                    <div class="section-header" :class="['nav-link', { active: isActiveRoute(section.to) }]"
                        @click="toggleSection(section)">
                        <font-awesome-icon :icon="section.icon" />
                        <span>{{ section.label }}</span>
                        <font-awesome-icon v-if="section.children"
                            :icon="section.expanded ? 'chevron-up' : 'chevron-down'" size="xs" class="chevron-icon" />
                    </div>
                    <ul v-if="section.children && section.expanded" class="nested-links">
                        <li v-for="child in section.children" :key="child.to" @click="updateListData()">
                            <router-link :to="child.to" :class="['nav-link', { active: isActiveRoute(child.to) }]">
                                <font-awesome-icon :icon="child.icon" />
                                <span>{{ child.label }}</span>
                            </router-link>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<script setup>
const loggedInUserId = 1;

import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { getUserLists } from '../../services/users';

const route = useRoute();
const router = useRouter();

const lists = ref([]);
async function updateListData() {
    lists.value = await getUserLists(loggedInUserId);
}

onBeforeMount(async () => {
    await updateListData();
    //lists.value = await getUserLists(loggedInUserId); // TODO: Login
})

const sections = ref([
    { label: 'Homepage', to: '/', icon: 'house', isActive: false },
    { label: 'Search', to: '/search', icon: 'search', isActive: false },
    {
        label: 'Lists',
        icon: 'book',
        isActive: false,
        expanded: true,
        children: [],
    },
    //{ label: 'Random', to: '/random', icon: 'shuffle', isActive: false },
]);

async function updateListsInSections() {
    // Map the lists to children structure
    const formattedChildren = lists.value.map((list) => {
        const formattedLabel = list.name.toLowerCase().replace(/\s+/g, '_'); // Convert label to lowercase and replace spaces with underscores
        let icon;

        // Assign icon based on list name
        switch (formattedLabel) {
            case 'favorites':
                icon = 'star';
                break;
            case 'want_to_read':
                icon = 'book-bookmark';
                break;
            case 'done_reading':
                icon = 'book-open';
                break;
            default:
                icon = 'bookmark'; // Default icon for other lists
        }

        return {
            id: list.id,
            userId: list.userId,
            isDefault: list.isDefault,
            visibility: list.visible,
            label: list.name,
            to: `/lists#${formattedLabel}`,
            icon: icon,
            isActive: false
        };
    });

    // Find the Lists section and update its children
    const listsSection = sections.value.find((section) => section.label === 'Lists');
    if (listsSection) {
        listsSection.children = formattedChildren;
    }
}


const isActiveRoute = (to) => {
    if (typeof to !== 'string' || !to.includes('#')) {
        return route.path === to; // Ako nema hash, proverava samo putanju
    }

    const [path, hash] = to.split('#');
    const currentPath = route.path;
    const currentHash = route.hash;
    return currentPath === path && (!hash || currentHash === `#${hash}`);
};

watch(lists, () => {
    updateListsInSections();
    console.log(sections.value)
}, { immediate: true });

/*onMounted(async () => {
    console.log("Liste: ", lists.value);
});*/

const toggleSection = (section) => {
    if (section.children) {
        section.expanded = !section.expanded;
    } else if (section.to) {
        router.push(section.to);
    }
};
</script>

<style scoped>
.sidebar {
    width: 250px;
    height: 100dvh;
    background-color: var(--primary);
    padding: 13px 26px;
    display: flex;
    flex-direction: column;
}

.logo {
    width: 100%;
    height: auto;
    object-fit: contain;
}

hr {
    margin: 13px 0;
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 10px;
    color: black;
    padding: 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-link i {
    margin-right: 10px;
}

.nav-link:hover,
.nav-link:active,
.section-header:hover {
    background-color: var(--primary_hover);
}

.nav-link.active {
    background-color: var(--bg);
    color: black;
}

.nested-links {
    margin-left: 20px;
    list-style: none;
    padding: 0;
}

ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

li+li {
    margin-top: 10px;
}

.section-header {
    position: relative;

    display: flex;
    align-items: center;
    text-decoration: none;
    gap: 10px;
    color: black;
    padding: 10px;
    border-radius: 4px;
    transition: background-color 0.3s;
    cursor: pointer;
}

.chevron-icon {
    position: absolute;
    right: 10px;
}
</style>