
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { RcaFormData } from '@/types';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// Removed ScrollArea import as it's handled by the parent Dialog in page.tsx

const rcaFormSchema = z.object({
  incidentTicketNumber: z.string().min(1, { message: 'Incident Ticket Number is required.' }),
  timeDetected: z.string().min(1, { message: 'Time and Date Detected is required.' }),
  timeRecorded: z.string().min(1, { message: 'Time and Date Recorded is required.' }),
  timeRestored: z.string().min(1, { message: 'Time and Date Restored is required.' }),
  affectedCi: z.string().min(1, { message: 'Affected Configuration Item is required.' }),
  severity: z.enum(['P0', 'P1', 'P2', 'P3', 'P4'], {
    required_error: 'Severity is required.',
  }),
  status: z.enum(['Open', 'Assigned', 'In Progress', 'Closed'], {
    required_error: 'Status is required.',
  }),
  incidentOwner: z.string().min(1, { message: 'Incident Owner is required.' }),
  notDetectedByMonitoringReason: z.string().optional(),
  description: z.string().min(1, { message: 'Description is required.' }),
  systemImpact: z.string().min(1, { message: 'System Impact is required.' }),
  businessImpact: z.string().min(1, { message: 'Business Impact is required.' }),
  rootCauseFindings: z.string().min(1, { message: 'Root Cause Findings are required.' }),
  correctiveActions: z.string().min(1, { message: 'Corrective Actions/Interim Solutions are required.' }),
  preventativeMeasures: z.string().min(1, { message: 'Long Term Preventative Measures are required.' }),
});

interface RcaFormProps {
  onSubmitRca: (data: RcaFormData) => void;
  onCancel: () => void;
  isLoading?: boolean; // Added isLoading prop
}

export function RcaForm({ onSubmitRca, onCancel, isLoading = false }: RcaFormProps) {
  const form = useForm<RcaFormData>({
    resolver: zodResolver(rcaFormSchema),
    defaultValues: {
      incidentTicketNumber: '',
      timeDetected: '',
      timeRecorded: '',
      timeRestored: '',
      affectedCi: '',
      incidentOwner: '',
      notDetectedByMonitoringReason: '',
      description: '',
      systemImpact: '',
      businessImpact: '',
      rootCauseFindings: '',
      correctiveActions: '',
      preventativeMeasures: '',
      severity: undefined, // Ensure no default for better placeholder experience
      status: undefined,   // Ensure no default for better placeholder experience
    },
  });

  function onSubmit(data: RcaFormData) {
    onSubmitRca(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
        <FormField
          control={form.control}
          name="incidentTicketNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Ticket Number</FormLabel>
              <FormControl>
                <Input placeholder="e.g., INC1234567" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="timeDetected"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time and Date Detected</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeRecorded"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time and Date Recorded</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="timeRestored"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time and Date Restored</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="affectedCi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Affected Configuration Item</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Server_XYZ, App_ABC" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['P0', 'P1', 'P2', 'P3', 'P4'].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {['Open', 'Assigned', 'In Progress', 'Closed'].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="incidentOwner"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Owner</FormLabel>
              <FormControl>
                <Input placeholder="e.g., John Doe" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notDetectedByMonitoringReason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>If the incident was not detected by monitoring, why not? (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide reasons if applicable" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Details, including stats/KPI)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detailed description of the incident..." {...field} rows={4} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="systemImpact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>System Impact (Which systems/application/infrastructure items are affected?)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the system impact..." {...field} rows={3} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessImpact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Impact</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the business impact..." {...field} rows={3} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rootCauseFindings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Root Cause Findings</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe the root cause findings..." {...field} rows={4} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="correctiveActions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Corrective Actions/Interim Solutions (How was the incident resolved? Workaround? Services restored?)</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe corrective actions and interim solutions..." {...field} rows={4} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preventativeMeasures"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Term Preventative Measures/Permanent Solution</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe long term preventative measures..." {...field} rows={4} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit RCA'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
