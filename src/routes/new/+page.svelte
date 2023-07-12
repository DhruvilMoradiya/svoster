<script lang="ts">
	import Authcheck from '$components/Authcheck.svelte';
	import { Input, Label, Textarea } from 'flowbite-svelte';
</script>

<Authcheck>
	<div class="w-[90%] mx-auto my-auto">
		<form>
			<div class="mb-6">
				<Label for="posterName" class="mb-2">Write your poster title</Label>
				<Input id="posterName" placeholder="Poster Name" />
			</div>
			<div>
				<Label for="posterDesc" class="mb-2">Write description about your poster (optional)</Label>
				<Textarea id="posterDecs" rows="4" placeholder="Poster Description" />
			</div>
		</form>
	</div>
</Authcheck>
