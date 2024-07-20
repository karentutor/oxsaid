import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

export default function CreateBusinessPictureForm({ control, handleFileChange, preview, formState }) {
  return (
    <FormField
      control={control}
      name="picture"
      render={({ field }) => (
        <FormItem className="space-y-0">
          <FormLabel>Business Picture</FormLabel>
          <FormControl>
            <Input
              type="file"
              onChange={(e) => {
                handleFileChange(e.target.files?.[0]);
                field.onChange(e.target.files?.[0]);
              }}
            />
          </FormControl>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded mt-2"
            />
          )}
          <FormMessage>{formState.errors.picture?.message}</FormMessage>
        </FormItem>
      )}
    />
  );
}
