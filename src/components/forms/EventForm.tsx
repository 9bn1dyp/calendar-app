'use client'
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import { eventFormSchema } from "@/schema/events"
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { createEvent, deleteEvent, updateEvent } from '@/server/actions/events';
import { AlertDialog, AlertDialogContent, AlertDialogTrigger, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog';
import { useState, useTransition } from 'react';

export function EventForm({ event }: { 
    event?: { 
        id: string; 
        name: string; 
        description?: string
        durationInMinutes: number
        isActive: boolean
    }}) {

    const [isDeletePending, startDeleteTransition] = useTransition()

    const form = useForm<z.infer<typeof
eventFormSchema>>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: event ??  {
            isActive: true,
            durationInMinutes: 30,
        },
    })
    async function onSubmit(values: z.infer<typeof eventFormSchema>) {

        const action = event == null ? createEvent : updateEvent.bind(null, event.id)
        const data = await action(values)

        if (data?.error) {
            form.setError("root", {
                message: "There was an error saving your event"
            })
        }
    }
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='flex gap-6 flex-col'>

                {form.formState.errors.root && (
                    <div className="text-destructive text-sm">
                        {form.formState.errors.root.message}
                    </div>
                )}

                {/* name field */}
                <FormField 
                control={form.control}
                name='name'
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Event Name</FormLabel>
                        <FormControl>
                            <Input {...field}/>
                        </FormControl>
                        <FormDescription>
                            The name users will see when booking
                        </FormDescription>
                        <FormMessage/>
                    </FormItem>
                )}
                />

                {/* duration field */}
                <FormField
                    control={form.control}
                    name="durationInMinutes"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>In minutes</FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                {/* description field */}
                <FormField 
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea className="resize-none h-32" {...field}/>
                            </FormControl>
                            <FormDescription>
                                The name users will see when booking
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                {/* active field */}
                <FormField 
                    control={form.control}
                    name='isActive'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center gap-2'>
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                                <FormLabel>Active</FormLabel>
                            </div>
                            <FormDescription>
                                Inactive events will not be visible for users to book
                            </FormDescription>
                        </FormItem>
                    )}
                />
                <div className='flex gap-2 justify-end'>
                    {event && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                variant="destructiveGhost" 
                                disabled={isDeletePending || form.formState.isSubmitting}>
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                    variant="destructive" 
                                    disabled={isDeletePending || form.formState.isSubmitting}
                                    onClick={() => {
                                        startDeleteTransition(async () => {
                                           const data = await deleteEvent(event.id)
                                        
                                        if (data?.error) {
                                            form.setError("root", {
                                                message: "There was an error deleting your event",
                                            })
                                        }
                                        
                                        })
                                    }}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                    <Button disabled={isDeletePending || form.formState.isSubmitting} 
                    type='button'>
                        <Link href="/events">Cancel</Link>
                    </Button>
                    <Button disabled={isDeletePending || form.formState.isSubmitting} 
                    type='submit'>Save</Button>
                </div>
            </form>
        </Form>
    )
}
